var webdriver = require('selenium-webdriver'),
    util = require('util'),
    runnerPath = require('./mocha.js'),

    q = require('q'),
        helper = require('./lib/util'),
        log = require('./lib/logger'),
        assert= require('selenium-webdriver/testing/assert'),
        apii = require('./logging'),
conf = require('./dataparser'),
    async =require('async'),

EventEmitter = require('events').EventEmitter;



/*
 * Runner is responsible for starting the execution of a test run and triggering
 * setup, teardown, managing config, etc through its various dependencies.
 *
 * The automate Runner is a node EventEmitter with the following events:
 * - testPass
 * - testFail
 * - testsDone
 * -testStart
 *
 * @param {Object} config
 * @constructor
 */
var Runner = function(config) {
 //console.log(config);
  this.preparer_ = null;
  this.driverprovider_ = require('./driverprovider')(this.config_);;
  this.config_ = config;

  if (config.v8Debug) {
    // Call this private function instead of sending SIGUSR1 because Windows.
    process._debugProcess(process.pid);
  }

  if (config.nodeDebug) {
    process._debugProcess(process.pid);
    var flow = webdriver.promise.controlFlow();

    flow.execute(function() {
      var nodedebug = require('child_process').fork('debug', ['localhost:5858']);
      process.on('exit', function() {
        nodedebug.kill('SIGTERM');
      });
      nodedebug.on('exit', function() {
        process.exit('1');
      });
    }, 'start the node debugger');
    flow.timeout(1000, 'waiting for debugger to attach');
  }

  if (config.capabilities && config.capabilities.seleniumAddress) {
    config.seleniumAddress = config.capabilities.seleniumAddress;
  }
  this.loadDriverProvider_(config);
  this.setTestPreparer(config.onPrepare);
};

util.inherits(Runner, EventEmitter);


/**
 * Registrar for testPreparers - executed right before tests run.
 * @public
 * @param {string/Fn} filenameOrFn
 */
Runner.prototype.setTestPreparer = function(filenameOrFn) {
  this.preparer_ = filenameOrFn;
};


/**
 * Executor of testPreparer
 * @public
 * @return {q.Promise} A promise that will resolve when the test preparers
 *     are finished.
 */
Runner.prototype.runTestPreparer = function() {
  return helper.runFilenameOrFn_(this.config_.configDir, this.preparer_);
};


/**
 * Grab driver provider based on type
 * @private
 *
 */
Runner.prototype.loadDriverProvider_ = function() {
    driverPath = './driverprovider';


  this.driverprovider_ = require(driverPath)(this.config_);
};


/**
 * Responsible for cleaning up test run and exiting the process.
 * @private
 * @param {int} Standard unix exit code
 */
Runner.prototype.exit_ = function(exitCode) {
  return helper.runFilenameOrFn_(
      this.config_.configDir, this.config_.onCleanUp, [exitCode]).
        then(function(returned) {
          if (typeof returned === 'number') {
            return returned;
          } else {
            return exitCode;
          }
        });
};


/**
 * Getter for the Runner config object
 * @public
 * @return {Object} config
 */
Runner.prototype.getConfig = function() {
  return this.config_;
};


/**
 * Get the control flow used by this runner.
 * @return {Object} WebDriver control flow.
 */
Runner.prototype.controlFlow = function() {
  return webdriver.promise.controlFlow();
};


/**
 * Sets up convenience globals for test specs
 * @private
 */
Runner.prototype.setupGlobals_ = function(browser_) {
    log.print("setting up globals")
    data_ =conf.confData
    data_.baseUrl =this.config_.baseUrl

    frameworkPath ="./frameworks/"+this.config_.app

        // Export browser,data and framework to the global namespace to be used in tests.
  global.browser = browser_;
    global.data = data_;
    global.framework = require(frameworkPath)


};


/**
 * Create a new driver from a driverProvider. Then set up a
 * new automate instance using this driver.
 * This is used to set up the initial automate instances and any
 * future ones.
 *
 * @param {?Plugin} The plugin functions
 *
 * @return {automate} a automate instance.
 * @public
 */
Runner.prototype.createBrowser = function() {
    console.log ('in create browser')
    var config = this.config_;
    var driver = this.driverprovider_.getNewDriver();

    var browser_ = driver;


    var self = this;

    browser_.ready =
        driver.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);


    browser_.getProcessedConfig = function () {
        log.print("getting config")
        return ready(config);
    };


  /*browser_.restart = function() {
      async.series([function(cb){
          log.print("in restart browser")

          self.shutdown_()
          cb()
      },function(cd){
          browser_=self.createBrowser();
          self.setupGlobals_(browser_);

          cd()
      }],function(err,res){

      })



  };*/
    browser_.forkNewDriverInstance = function(opt_useSameUrl, opt_copyMockModules) {
        var newBrowser = self.createBrowser();
        if (opt_copyMockModules) {
            newBrowser.mockModules_ = browser_.mockModules_;
        }
        if (opt_useSameUrl) {
console.log('getting url')
                newBrowser.get(self.config_.baseUrl);
        }
        return newBrowser;
    };

    browser_.restart = function() {
        // Note: because tests are not paused at this point, any async
        // calls here are not guaranteed to complete before the tests resume.
        async.series([function(cb){
            log.print("in restart browser")
        self.driverprovider_.quitDriver(browser_);
            cb()},
            function(cb){
        browser_ = browser_.forkNewDriverInstance(true, false);


                cb()
            },function(cb){
                self.setupGlobals_(browser_);
                cb()
            }],function(err,res){
            if (err)
            throw err
                console.log('getting url= '+res)
            browser_.getSession().then(function(session) {
                log.debug('WebDriver session successfully started with capabilities ' +browser_.getCapabilities['version']+" try this"+
                    util.inspect(browser_.getCapabilities()));
                browser_.manage().deleteAllCookies();
                browser_.manage().window().maximize();},function(err){
                log.debug("Cannot get session"+browser_)
            })
                browser.get(self.config_.baseUrl).then(function(url){
                    log.print("url opened")
                });
                browser_.get(self.config_.baseUrl);
        })
    };

  return browser_;
};


/**
 * Final cleanup on exiting the runner.
 *
 * @return {q.Promise} A promise which resolves on finish.
 * @private
 */
Runner.prototype.shutdown_ = function() {
  return q.all(
      this.driverprovider_.getExistingDrivers().
          map(this.driverprovider_.quitDriver.bind(this.driverprovider_)));
};

/**
 * The primary workhorse interface. Kicks off the test running process.
 *
 * @return {q.Promise} A promise which resolves to the exit code of the tests.
 * @public
 */
Runner.prototype.run = function() {
  var self = this,
      testPassed,

      browser_,
      results;

  // 1) Setup environment
  return this.driverprovider_.setupEnv().then(function() {
  // 2) Create a browser and setup globals
    browser_ = self.createBrowser();
    self.setupGlobals_(browser_);


    return browser_.ready.then(

        browser_.getSession()).then(function(session) {
        log.debug('WebDriver session successfully started with capabilities ' +browser_.getCapabilities['version']+" try this"+
        util.inspect(browser_.getCapabilities()));
        browser_.manage().deleteAllCookies();
        browser_.manage().window().maximize();
        //browser_.manage().timeouts().pageLoadTimeout(120000);


    }, function(err) {
      log.error('Unable to start a WebDriver session.');
      throw err;
    }).then(browser_.get(self.config_.baseUrl).then(function(){
        browser_.manage().timeouts().pageLoadTimeout(120000);
        browser_.manage().timeouts().implicitlyWait(120000);
    },function(err){
        /*log.error("Page: " + self.config_.baseUrl + " failed to load after 2 mins")
        log.err(err)
        apii.assertTrue("Page: "+self.config_.baseUrl,'loaded after 2 mins',err)*/




    }));

  }).then(function() {

// 4) Execute test cases

      var restartDriver = function() {
          browser_.restart()



      };
var regeturl =function(){
    browser_.get(self.config_.baseUrl).then(function(){
        browser_.manage().timeouts().pageLoadTimeout(120000);
        browser_.manage().timeouts().implicitlyWait(120000);})
}




    //self.on('testEnd', regeturl)


      self.on('testStart',function(testInfo){
          testInfo.prod_name=self.config_.product
          testInfo.env_name=self.config_.env
          testInfo.browser_name=self.config_.capabilities.browserName
          apii.checkproductName(testInfo)


      })
      if (self.config_.restartbetweentests){
          self.on('testPass',restartDriver)
          self.on('testFail',restartDriver)
      }

   log.print('Running with spec files ' + self.config_.specs);

//this line calls the framework run method
    return runnerPath.run(self, self.config_.specs);

  }).then(function(testResults) {

    results = testResults;


  // 7) Teardown
  }).then(function() {

    self.emit('testsDone', results);
    testPassed = results.failedCount === 0;

      return self.driverprovider_.teardownEnv();



  // 9) Exit process
  }).then(function() {
    var exitCode = testPassed ? 0 : 1;
    return self.exit_(exitCode);
  }).fin(function() {
   return self.shutdown_();
  });
};

/**
 * Creates and returns a Runner instance
 *
 * @public
 * @param {Object} config
 */
module.exports = Runner;
