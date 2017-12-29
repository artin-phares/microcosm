const config = require('../../../config.js');

const runUnitTests = require('../../utils/run-unit-tests');
const packConfig = require('../../utils/unit-tests-pack-config');

module.exports = () =>
    runUnitTests({
        packConfig,
        entry: config.test.unit.entry,
        watch: false
    });