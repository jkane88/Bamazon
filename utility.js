module.exports = {
    printTitle: function (title, borderLength) {
        return console.log(`
            \r${'='.repeat(borderLength)}
            \r\tBamazon - ${title}
            \r${'='.repeat(borderLength)}\n`);
    },

    inputError: function (message, callback) {
        console.clear();
        console.log(message + '\n');
        if (callback != null) return callback();
    }
};