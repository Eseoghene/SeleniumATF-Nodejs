/**
 * Created by ese.mentie on 2/16/16.
 */
/** Storefront Sanity tests **/


describe('Sanity Tests', function() {
    it('Search for product', function() {

        framework.searchsubmit(data.search);
    });
    xit('Checkout', function() {


        framework.searchsubmit(data.search);
        framework.addtocart()
        framework.login(data.login,data.myacct)
        framework.selectaddress()
        framework.selectpayment()
        framework.validatesuccesspage()
    });

    it('LOGOUT using hyperlink in top RIGHT HAND side of header', function() {

        framework.homelogin(data.login,data.myacct);

        framework.logout(data.login,data.myacct);
    });
    it('Login with Valid Email and Password', function() {

        framework.homelogin(data.login,data.myacct);

    });








    });
