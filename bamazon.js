
const mysql = require('mysql');
const Table = require('cli-table');

//  CONNECTION 
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

//  CLI-TABLES SETUP
let productsTable = new Table({
    head: ['ID', 'Product', 'Price', 'Stock'],
    colWidths: [6, 30, 10, 10],
    colAligns: ['left', 'left', 'right', 'right']
});

//  BAMAZON 
module.exports = {

    connect: function () {
        return new Promise((resolve, reject) => {

            connection.connect(err => {
                if (err) reject(err);
                resolve(console.log(`\nConnected to Bamazon.`));
            });
        });
    },

    endConnection: function () {
        return connection.end();
    },

    modifyStock: function (item, qty) {

        if (this.qty < 0);

        let query = `
            UPDATE products 
            SET stock_quantity = ${item.stock + qty} 
            WHERE item_id = ${item.id}`;

        return new Promise((resolve, reject) => {
            connection.query(query, err => {
                if (err) reject(err);
                resolve();
            });
        });
    },

    validateProduct: function (id) {
        let query = `SELECT * FROM products WHERE item_id = ${id}`;

        return new Promise((resolve, reject) => {

            connection.query(query, (err, res) => {
                if (err) reject(err);
                return resolve(res);
            });
        });
    },


    viewProducts: function () {
        // These resets are required to display the cli-table correctly.
        this.availableItems = [];
        productsTable.length = 0;

        return new Promise((resolve, reject) => {

            connection.query('SELECT * FROM products', (err, prods) => {
                if (err) reject(err);

                // Populate availableItems and productsTable with products.
                let item;
                prods.forEach(prod => {
                    item = {
                        id: prod.item_id,
                        name: prod.product_name,
                        price: parseFloat(prod.price).toFixed(2),
                        stock: prod.stock_quantity
                    }
                    productsTable.push([item.id, item.name, item.price, item.stock]);
                });

                // Resolve and print the products cli-table.
                resolve(console.log('All products:\n' + productsTable.toString()));
            });
        });
    }
}
