//validate elements are present first always

var async = require('async');


//var config = require('./dataconfig');
var h = require('./../actions'),
    l = require('./../logging'),
    v = require('./../validations')
module.exports = {
    /*Logs into the storefront login page */
    //Validate Login link text before clicking
    homelogin: function (loginobjects, acctobjects) {
        console.log("looog"+browser.getSession())
        locatortype = data.type.css
        locator = loginobjects.css
        locatorlabel = loginobjects.label
        title = loginobjects.pageTitle
        emailbox = loginobjects.emailboxid
        type = 'id'
        userid = loginobjects.email
        passwordbox = loginobjects.passwordboxid
        password = loginobjects.password
        submitbutton = loginobjects.loginBtnid
        validtype = 'id'
        acctid = acctobjects.acctId
        text = acctobjects.acctLinkText
        submitbtnlabel = loginobjects.loginBtnlabel
        paswordboxlabel = loginobjects.passwordboxlabel
        loginboxlabel = loginobjects.emailboxlabel


        async.series([function (callback) {

            h.clickelement(locatortype, locator, locatorlabel, callback)


        },
            function (callback) {


               h.login(type, title, emailbox, userid, passwordbox, password, submitbutton, submitbtnlabel, paswordboxlabel, loginboxlabel);



                callback()

            }], function (err, result) {
            if (err) {
                l.errorroutine(err);

            }
            v.validateelementcontainstext(validtype, acctid, text, 'Account Name')
        });

    },

    /*Logs user out of the Storefront*/
    //Validate Login link text before clicking
    logout: function (loginobjects, acctobjects) {
        locatortype = data.type.css
        locator = loginobjects.css
        locatorlabel = loginobjects.label
        hovertype = data.type.xpath
        hoverelement = data.myacct.myAcctxpath
        hoverlabel = 'Account Name'
        clicktype = data.type.xpath
        clickelement = data.myacct.logoutxpath
        clicklabel = data.myacct.logoutLinkText
        pagetitle = data.login.pageTitle
        validtype = 'id'
        acctid = acctobjects.acctId
        text = acctobjects.acctLinkText

        async.series([function (cb) {
            l.logtoconsole("logging out");
            //v.validateelementcontainstext(validtype, acctid, text, 'Account Name')
            h.hoverelementandclick(hovertype, hoverelement, hoverlabel, clicktype, clickelement, clicklabel)
            v.validatepagetitle(pagetitle);
            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);

            }

        });
    },
    /*Enters text into the Search box, Clicks the submit button and validates the Search Result*/
    searchsubmit: function (searchobj) {
        searchtype = data.type.name
        searchbox = data.search.searchBoxname
        searchtext = data.search.searchText
        buttontype = data.type.css
        button = data.search.csssubmitBtn
        prodtype = data.type.xpath
        prodelement = data.firstprod.xpathprodname
        label = "Second Product"


        async.series([function (cb) {
            h.sendkeys(searchtype, searchbox, 'Search TextBox', searchtext);
            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
            h.clickbutton(buttontype, button, 'Search Button');
            module.exports.validateproductsearch(prodtype, searchtext, prodelement, label);
        });
    },
    login: function (loginobjects, acctobjects) {

        title = loginobjects.pageTitle
        emailbox = loginobjects.emailboxid
        type = 'id'
        userid = loginobjects.email
        passwordbox = loginobjects.passwordboxid
        password = loginobjects.password
        submitbutton = loginobjects.loginBtnid
        validtype = 'id'
        acctid = acctobjects.acctId
        text = acctobjects.acctLinkText
        submitbtnlabel = loginobjects.loginBtnlabel
        paswordboxlabel = loginobjects.passwordboxlabel
        loginboxlabel = loginobjects.emailboxlabel
        async.series([function(cb){
            h.login(type, title, emailbox, userid, passwordbox, password, submitbutton, submitbtnlabel, paswordboxlabel, loginboxlabel);


            cb()
        }

        ], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }



        });
    },
    /*validates search result*/
    validateproductsearch: function (type, searchtext, prodelement, label) {
        var SearchTitle = "Search results for: \'" + searchtext + "\' | testing Nigeria";
        async.series([function (cb) {
            v.validatepagetitle(SearchTitle);
            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
            v.validateelementcontainstext(type, prodelement, searchtext, label);
        });
    },

    //adds a product to cart and confirms that the product is in the cart
    addtocart: function () {
        prodtype = data.type.xpath
        prodelement = data.firstprod.xpathprodname
        label = "Second Product"
        namexpath= data.product.xpathprodname
        buttontype=data.type.css
            BuyNowButton= data.product.buynowbtn
            cartTitle = data.cart.pageTitle
                carticontext =
                    carticontextxpath =
            prodxpath=
                checkoutbtn= data.cart.checkoutbtn
async.series([function(cb){
    h.clickelement(prodtype, prodelement, label, cb)

}],function(err,res){
    async.waterfall([function (cb) {


        h.getText(prodtype, namexpath, 'Product name', cb);

    }], function (err, result) {
        if (err) {
            l.errorroutine(err);
        }
        l.logtoconsole('result = '+result)
        async.series([function(cb){
            h.clickelement(buttontype, BuyNowButton, ' Add to Cart Button',cb)

        }
        ],function(err,res){
                if (err) {
                    l.errorroutine(err);
                }
                h.clickbutton(prodtype,checkoutbtn,'Proceed to Checkout Button')
        }
        )


    });
})



    },
    /** Clicks a product to visit a product page**/
    gotoproductpage: function () {

    },
    /** gets product price,special price, name, sku, sold count,review count, imagefile name and stores in an array **/
    getproductdetails: function () {

    },

    checkout: function () {

    },
    /*Validates that a product is in the cart */
    validateproductincart: function (cartTitle, prodxpath, namexpath) {


        // Ese: Refactor:USe product count in cart to Iterate
        v.validatepagetitle(cartTitle);
        /*driver.isElementPresent(webdriver.By.xpath(prodxpath)).then(
            function (present) {
                var prodname = module.exports.textArray[namexpath];

                var bool;

                if (present) {
                    driver.findElement(webdriver.By.xpath(prodxpath)).getText().then(
                        function (check) {
                            console.log("product at cart is :" + check + ".");
                            console.log("productname @ Product page is: " + prodname)
                            var basic = prodname.indexOf(check) > -1;
                            if (!basic) {
                                console.log("Validating first product")
                                bool = false;
                                console.log("!bool=" + bool)
                                console.log("Validation failed! checking second product in cart")
                                var prodxpat = '//!*[@id="shopping-cart-table"]/tbody/tr[2]/td[2]/h2'

                                driver.isElementPresent(webdriver.By.xpath(prodxpat)).then(
                                    function (present) {
                                        if (!present) {
                                            console.log('No Second product');
                                            bool = false;
                                            console.log("bool= " + bool);
                                            console.log("Cart does not contain " + prodname);
                                            module.exports.takescreenshot();
                                            module.exports.actualmsg('Cart contains :'
                                                + check);
                                            module.exports
                                                .expectedmsg('Cart contains :' + prodname);
                                            assert(check).equalTo(prodname);

                                        } else {
                                            driver.findElement(webdriver.By.xpath(prodxpat)).getText().then(
                                                function (check1) {

                                                    console.log("product at cart is :" + check1 + ".");
                                                    console.log("productname is :" + prodname + ".");
                                                    var basic = prodname.indexOf(check1) > -1;
                                                    if (basic) {
                                                        bool = true;
                                                        console.log("Cart contains " + prodname);
                                                        console.log("bool= " + bool);
                                                    } else {
                                                        console.log("Cart does not contain " + prodname);
                                                        module.exports.takescreenshot();
                                                        module.exports.actualmsg('Cart contains :'
                                                            + check1);
                                                        module.exports
                                                            .expectedmsg('Cart contains :' + prodname);
                                                        assert(prodname).contains(check1);
                                                        return false;
                                                    }
                                                })
                                        }
                                    })
                            } else {
                                console.log("Cart contains " + prodname);
                                bool = true;
                                console.log("bool= " + bool);
                            }
                        })

                } else {
                    console.log("prodName not found")
                    module.exports.takescreenshot();
                    module.exports.logtofile("Product Name not found");
                }
            })*/
    },

    selectpayment: function () {

        type=   data.type.xpath
        paymentheader = data.payment.xpathpymttab
        paymentheaderlbl =data.payment.label
        pymtoption= data.payment.stagxpathPodBtn
        pymtopt=data.payment.stagxpathPod
        pymtoptionlbl= data.payment.podlabel
        pymtbtn= data.payment.idpymtBtn
        pymtbtnlbl=data.payment.PymtBtnlabel

        async.series([function (cb) {

            v.validateelementdisplayed(type, paymentheader, paymentheaderlbl);
            //v.validateelementcontainstext(type,pymtoption,pymtoptionlbl)
            h.mousemoveandclick('xpath', pymtoption, pymtoptionlbl);
            v.valradioBtnisselected('xpath',pymtoption, pymtoptionlbl);

            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
            async.series([function(cb){
                h.clickelement(type, pymtbtn, pymtbtnlbl,cb);
            }
            ],function(err,res){
                if (err) {
                    l.errorroutine(err);
                }
            })

        });
    },
/**selects existing address **/
    selectaddress: function () {

        addresstype=data.type.xpath
        addressheader=data.address.xpathaddresstab
        addresslabel=data.address.label
        btnlabel=data.address.BtnLabel
        deliverbtn=data.address.xpathdelBtn
        bordertype=data.type.xpath
        addressborder=data.address.addressborder
        borderlabel=data.address.borderLabel
        async.series([function (cb) {
            v.validateelementdisplayed(addresstype,addressheader, addresslabel);

            v.valradioBtnisselected(addresstype,deliverbtn, btnlabel);
            v.validateelementdisplayed(bordertype, addressborder, borderlabel);
            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
        });
    },

    validatesuccesspage: function () {

        browser.sleep(7000)
        sucessurl =  data.baseUrl+data.payment.sucessUrl
        successmsgtype=data.type.xpath
        successmsgelement=data.payment.xpathsucessMsg
        successmsg=data.payment.sucessMsg
        async.series([function (cb) {
            l.logtoconsole("data.baseurl = "+sucessurl)
            v.validateurl(sucessurl);
            v.validateelementdisplayed(successmsgtype, successmsgelement, successmsg);
            v.validateelementtext(successmsgtype, successmsgelement, successmsg,'Success Message');
            cb()
        }], function (err, result) {
            if (err) {
                l.errorroutine(err);
            }
        });
    }



}


