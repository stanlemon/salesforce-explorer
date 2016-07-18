if (process.env.NODE_ENV === 'development') {
    const electronHot = require('electron-hot-loader');
    electronHot.install({higherOrderFunctions: ['connect']});
    electronHot.watchJsx(['src/**/*.jsx']);
    electronHot.watchCss(['src/assets/**/*.css']);
}

require('dotenv').config();
require('./index.jsx');
