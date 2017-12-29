const config = require('../../config');
const nodemon = require('gulp-nodemon');

module.exports = function() {
    return nodemon({
        script: config.src.serv.output.entry,
        watch: config.src.serv.output.root,
        env: {
            NODE_PATH: '$NODE_PATH;' + __dirname
        },

        // delay restart a bit so watched build has time
        // to cleanup and rebuild
        delay: '2500'
    });
};