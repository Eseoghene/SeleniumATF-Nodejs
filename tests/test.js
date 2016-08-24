//var mock =require('./frameworks/mock')
var valid =require('./../validations');
var act =require('./../actions')

describe('Helper Module test', function() {
    describe('Positive Validations', function() {
        xit('validate page title',function(){
            valid.validatepagetitle('Online Shopping | Phones, Fashion, Electronics | testing Nigeria')
        })

        xit('validate not page title',function(){
            valid.validatenotpagetitle('a.com')

        })
        xit('validate element is present in DOM',function(){
            valid.validateelementpresent('name','q','SearchBox')
        })

      xit('validate element is displayed',function(){
          valid.validateelementdisplayed('class','main-logo','testingLogo')
      })
        xit('validate element contains text',function(){
            valid.validateelementcontainstext('id','cat_0','Phone','First Category')
        })
        xit('validate element text is correct',function(){
            //*[@id="submenu-0"]/div/ul[1]/li/ul/li[1]/a
            valid.validateelementtext('xpath','//*[@id="main-content-container"]/div[5]/div/ul/li[1]/div/div/div[1]/div[1]/a/span','first Product','Tprodlistry')
        })

    xit('validate url is correct',function(){
        valid.validateurl('http://www.testing.com/')
    })
       xit('validate page does not return 404',function(){
           valid.validatepagenot404('testing.com')
       })








});
    /*describe('Val product text',function(){

        before(function(){
               //browser.get('http://www.testing.com/blackberry-phones')
            act.sendkeys('name','q','SearchBox','Samsung TV')
            act.clickelement('css','div.search-submit','Search Button')



        })
        it('validate element text is correct',function(){

            valid.validateelementtext('xpath','//!*[@id="main-content-container"]/div[5]/div/ul/li[1]/div/div/div[1]/div[1]/a/span','BlackBerry - Leap - Grey','prodlistry')
        })
    })
*/
    describe(' PositiveActions',function(){
        xit('clear keys',function(){
            act.clearkeys('name','q','SearchBox')

        })
        xit('Send Keys',function(){
            act.sendkeys('name','q','SearchBox','Window')
        })

       xit('Clear and Send Keys',function(){
           act.clearandsendkeys('name','q','SearchBox','Window')
       })

    it ('Hover and Click Menu',function(){
        act.hoverelementandclick('id','cat_0','FirstCategory','xpath','//*[@id="submenu-0"]/div/ul[1]/li/a')

        })

    xit('Click Element',function(){
        act.clickelement('class','main-logo','testingLogo')
    })
   xit('Scroll Vertically to A position',function(){
    act.scrolldown(100,400)

        })

   xit('scroll horizontally',function(){
    act.scrollto(200,490)
    })
      xit('scroll to bottom',function(){
          act.scrollToEnd()
      })
        xit('scroll to top',function(){
            act.scrollToTop()
        })

        xit('Open Url',function(){
            act.openurl('http://www.testing.com','Online Shopping | Phones, Fashion, Electronics')
        })



    })
});