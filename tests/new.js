/**
 * Created by ese.mentie on 2/11/16.
 */
var valid =require('./../validations');
var act =require('./../actions')

describe('PositActions',function(){
    it('Send Keys',function(){
        act.sendkeys('name','q','SearchBox','Window')
    })

    xit('Clear and Send Keys',function(){
        act.clearandsendkeys('name','q','SearchBox','Window')
    })
})
