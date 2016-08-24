/*Common actions used by all product frameworks*/
//You'll need to parse the selector of the element as a String
// through the argument "type" in every function used! e.g::: "css"


var webdriver = require('selenium-webdriver');
var until = require('selenium-webdriver').until;
var async = require('async');
var val =require('./validations'),
    logs= require('./logging')
    uttil =require('./helpers')


module.exports = {





    openurl: function (url, title) {
        // loggs.logtoconsole("proc= "+process.cwd());
        browser.manage().timeouts().pageLoadTimeout(120000);
        browser.get(url).then(function () {
        }, function (err) {
            logs.logtoconsole("Error Title: " + err.state);
            logs.assertTrue('Page','Displayed',err)

        });
        //module.exports.closetestingpopup(url);
        browser.manage().timeouts().implicitlyWait(20000);
        val.validatepagetitle(title);

    },

    openNewWindow: function () {
        var script = "window.open()";
        browser.executeScript(script);
    },

    waitUntilLoadingComplete: function (loaderxpath) {
        var elem = browser.findElement(webdriver.By.xpath(loaderxpath));
        browser.wait(until.elementIsNotVisible(elem));
    },
    login: function (type, url, emailbox, userid, passwordbox, password, submitbutton,submitbtnlabel,paswordboxlabel,loginboxlabel) {
boxtype ="id"
        async.series([function(cb){
            //val.validateurl(url);
            logs.logtoconsole("logging in");

            cb()
        }

        ], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
            module.exports.clearandsendkeys(boxtype, emailbox, loginboxlabel, userid)
            module.exports.sendkeys(boxtype, passwordbox, paswordboxlabel, password);
            module.exports.clickbutton(type, submitbutton, submitbtnlabel)



        });
    },


    //Rafa::: use this function to click an element with any selector

    clickelement: function (type, element, label,cb) {
        //Rafa:::: Get this function from validations.js
      //val.validateelementpresent(type, element, label);
      //async.series()
      val.validateelementdisplayed (type, element, label)
      uttil.findelement(type, element).click().then(function () {
          logs.logtoconsole(label+' is clicked')
          cb(null,browser.manage().timeouts().implicitlyWait(500000))

        }, function (err) {
           logs.errorroutine(err);
        }
      );
browser.manage().timeouts().implicitlyWait(500000)
    },
    clickbutton: function (type, element, label) {
        //Rafa:::: Get this function from validations.js
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).click().then(function () {
            logs.logtoconsole(label+' is clicked')
            browser.manage().timeouts().implicitlyWait(100000)

        }, function (err) {
            logs.errorroutine(err);
        });

    },getText: function (type, element,label,callback) {
 var name;
        val.validateelementpresent(type, element, label)
        uttil.findelement(type, element).getText().then(function(Text){
            logs.logtoconsole(label+'  is = '+Text)
            name =Text
            callback(null,name)
        },function(err){
          //cb(null,err)
            logs.errorroutine(err);
        })


    },
    //Rafa::: use this function to send keys with any selector
    sendkeys: function (type, element, label, text) {
        //Rafa:::: Get this function from validations.js
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).sendKeys(text).then(function(){
            logs.logtoconsole('PASS: '+text+' entered into '+label)
                //cb(null,browser.manage().timeouts().implicitlyWait(100000))
        },
            function(err){
            logs.errorroutine(err)
        });

    },

    //Rafa::: use this function to clear keys with any selector
    clearkeys: function (type, element, label) {
        //Rafa:::: Get this function from validations.js
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).clear().then(function(){
                logs.logtoconsole('PASS: '+label+ ' cleared')

            },
            function(err){
                logs.errorroutine(err)
            });

    },

    //Rafa::: use this function to clear text and send keys with any selector
    clearandsendkeys: function (type, element, label, text) {
        async.series([function (cb) {

           module.exports.clearkeys(type, element, label)
cb(null,module.exports.sendkeys(type, element, label, text))

        }], function (err, result) {


            if(err) {
                logs.errorroutine(err);
            }
        });
    },

    //Rafa::: use this function to move mouse to element with any selector
    mousemovetoelement: function (type, element, label) {

            val.validateelementpresent(type, element, label);
            browser.actions().mouseMove(uttil.findelement(type, element)).perform().then(function(){
                    logs.logtoconsole('PASS: Moved to '+label)
                },
                function(err){
                    logs.errorroutine(err)
                });;

    },
    mousemoveandclick: function (type, element, label) {

            val.validateelementpresent(type, element, label);
            browser.actions().mouseMove(uttil.findelement(type, element)).click().perform().then(function(){
                    logs.logtoconsole('PASS: Moved to and Clicked '+label)
                },
                function(err){
                    logs.errorroutine(err)
                });

    },

    //Rafa::: use this function to move mouse to element (hover) and click element with any selector
    hoverelementandclick: function (hovertype, hoverelement, hoverlabel, clicktype, clickelement, clicklabel) {
            module.exports.mousemovetoelement(hovertype, hoverelement, hoverlabel)
            browser.sleep(10000)
            module.exports.mousemoveandclick(clicktype, clickelement, clicklabel)
    },

    //Rafa::: use this function to select a checkbox if it is unselected...with any selector
    selectcheckboxifunselected: function (type, element, label) {
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).isSelected().then(function (ischecked) {
            if (ischecked) {
                logs.logtoconsole(label + ' Checkbox is already selected');
            } else {
                module.exports.clickelement(type, element, label);
            }

        });

    },
    //Rafa::: use this function to unselect a checkbox if it is already selected...with any selector
    unselectcheckboxifselected: function (type, element, label) {
        val.validateelementpresent(type, element, label);
        uttil.findelement(type, element).isSelected().then(function (ischecked) {
            if (ischecked) {
                logs.logtoconsole(' unchecking the checkbox ');
                module.exports.clickelement(type, element, label);
            } else {
                logs.logtoconsole(label + ' Checkbox is already unchecked');
            }
        });
    },

    toogleaccordionandclick: function (elementtype, parentloc, childloc, parentlabel, childlabel, pageheaderxpath, pageheadertext) {
        async.series([function (callbackpro) {
            logs.logtoconsole("Clicking " + parentlabel);
            module.exports.clickelement(elementtype, parentloc,parentlabel);
            logs.logtoconsole("Clicking " + childlabel);
            module.exports.clickelement(elementtype, childloc, childlabel);
            val.validateelementtext(pageheaderxpath, pageheadertext);
            callbackpro(null);
        }], function (err, result) {
            if(err) {
               logs.errorroutine(err);
            }
        });
    },



    switchtomainwindow: function () {

        //Ese: add a validation for the exception where it cannot find the window i.e function(err)
        var mainwinHandle;
        browser.wait(function () {
            logs.logtoconsole("Getting all Window handles");
            return browser.getAllWindowHandles().then(function (Window) {
                logs.logtoconsole("All Window Handles: " + Window);
                logs.logtoconsole("Main Window Handle: " + Window[0]);
                logs.logtoconsole("prod Window Handle: " + Window[1]);
                return mainwinHandle = Window[0];

            });
        }, 6000).then(function () {
        }, function (err) {
           logs.errorroutine(err);
        })
        browser.wait(function () {
            logs.logtoconsole("Main Window Handle:" + mainwinHandle);
            logs.logtoconsole("trying to switch to Main window");
            return browser.switchTo().window(mainwinHandle).then(function (Switch) {
                return browser.getWindowHandle().then(function (currhandle) {
                    logs.logtoconsole("Current Window Handle: " + currhandle);
                    if (currhandle === mainwinHandle) {
                        logs.logtoconsole('switched to main window');
                        return true;
                    }
                });
            });
        }, 6000).then(function () {
        }, function (err) {
           logs.errorroutine(err);
        });

    },

    switchtowindow: function (state) {
async.series([function (next){
        getWindowHandles(next)

}], function (err, result) {
    if(err) {
        logs.logtoconsole(err);
    }
    logs.logtoconsole('result = '+result)
    switchto(state,result)
});


    },




    scrolldown: function (hor, ver) {
        var script = '"window.scrollBy(' + hor + ',' + ver + ')", ""';
        browser.executeScript(script);
    },

    scrollto: function (hor, ver) {
        var script = "window.scrollTo('" + hor + "','" + ver + "')";
        browser.executeScript(script);
    },





    scrollToTop: function () {
        var script = "window.scrollTo(0,-Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))";
        browser.executeScript(script);
    },

    scrollToEnd: function () {
        var script = "window.scrollTo(0,document.body.scrollHeight)";
        browser.executeScript(script);
    }
}
