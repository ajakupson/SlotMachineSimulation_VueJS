const path = require('path');
module.exports = {
    entry: {
        main: './app/app.js',
    },
    output: {
        path: path.join(__dirname, './app/build'),
        filename: '[name].bundle.js'
    },
    mode: 'development'
}
