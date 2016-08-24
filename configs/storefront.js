/**
 * Created by ese.mentie on 1/21/16.
 */
exports.config = {


    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run.
    //
    specs: [
        'tests/storefront/sanitytests.js'
    ],
    seleniumAddress:'http://localhost:4444/wd/hub',
    // Patterns to exclude.
   /* exclude: [
        'test/spec/multibrowser/!**',
        'test/spec/mobile/!**'
    ],*/
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. Cerebro can run multiple capabilties at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude option in
    // order to group specific specs to a specific capability.
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: {
        browserName: 'chrome'
    },/*, {
        browserName: 'firefox',
        specs: [
            'test/ffOnly/!*'
        ]

    },{
        browserName: 'phantomjs',
        exclude: [
            'test/spec/alert.js'
        ]
    }*/
    testDir:'./storefront/',
    app:'storefront',
    //
    // ===================
    // Test Configurations
    // ===================
    //
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    //  with "/", the base url gets prepended.
    baseUrl: 'http://staging.testing.com',
    //
    // Default timeout for all waitForXXX commands.
    waitforTimeout: 1000,




    mochaOpts: {
        ui: 'bdd',
        reporter: 'xunit',
        timeout: 10000000
    },

    env:'staging',
    product: 'storefront',

    // =====
    // Hooks
    // =====
    // Run functions before or after the test. If one of them returns with a promise
    // will wait until that promise got resolved to continue.
    //
    // Gets executed before all workers get launched.
    onPrepare: function() {
        console.log('let\'s go');
    },
    //
    // Gets executed before test execution begins. At this point you will have access to all global
    // variables like `browser`. It is the perfect place to define custom commands.
    beforeEach: function() {
        console.log('run the tests');

    },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function(failures, pid) {
        console.log('finish up the tests');
    },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() {
        console.log('that\'s it');
    }
};

