const util = require('./utility');
const bamazon = require('./bamazon');
const inquirer = require('inquirer');

bamazon.connect().then(promptCustomerOptions);

//  CUSTOMER 
function promptCustomerOptions() {

    util.printTitle('Customer', 40);

    inquirer.prompt([{
        name: 'option',
        type: 'list',
        choices: [
            'Buy product',
            'Browse products',
            'Exit'
        ],
        message: 'Pick an option:'
    }]).then(answer => {

        console.clear();

        switch (answer.option) {
            case 'Buy product':
                bamazon.viewProducts()
                    .then(promptBuyProduct);
                break;
            case 'Browse products':
                bamazon.viewProducts()
                    .then(promptCustomerOptions);
                break;
            default:
                bamazon.endConnection();
                break;
        }
    });
}

//  BUY 
function promptBuyProduct() {

    console.log('\nCREATE PURCHASE ORDER');

    inquirer.prompt([{
            name: 'itemId',
            type: "prompt",
            message: "Item ID: "
        },
        {
            name: 'qty',
            type: "prompt",
            message: "Item QTY: "
        }
    ]).then(req => {

        if (req.itemId.trim() === '') {
            return util.inputError('Item ID cannot be blank.', () => {
                bamazon.viewProducts().then(promptBuyProduct);
            });
        }

        bamazon.validateProduct(req.itemId).then(res => {

            if (!res.length) {
                return util.inputError('Invalid item ID', () => {
                    bamazon.viewProducts().then(promptBuyProduct);
                });
            }

            if (req.qty > res[0].stock_quantity || req.qty < 0) {
                return util.inputError('Invalid quantity.', () => {
                    bamazon.viewProducts().then(promptBuyProduct);
                });
            }

            let item = {
                id: res[0].item_id,
                name: res[0].product_name,
                price: res[0].price,
                stock: res[0].stock_quantity
            };

            console.clear();
            bamazon.modifyStock(item, parseInt(req.qty * -1))
                .then(() => {
                    return bamazon.viewProducts();
                })
                .then(() => promptAnotherPurchase(req.qty, item));
        });
    });
}

// ANOTHER PURCHASE??
function promptAnotherPurchase(qty, item) {
    console.log('\nPURCHASED:');
    console.log(`(${qty}) ${item.name} | $${item.price} ea  | $${qty * item.price} total\n`);

    inquirer.prompt({
        type: 'confirm',
        name: 'accept',
        message: 'Make another purchase?'
    }).then(confirm => {
        console.clear();
        if (!confirm.accept) return promptCustomerOptions();
        bamazon.viewProducts().then(promptBuyProduct);
    });
}