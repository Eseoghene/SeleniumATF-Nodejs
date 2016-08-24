/**
 * Created by ese.mentie on 2/3/16.
 */
/* Mock framework to test end to end workflow */

var data = require('./dataconfig');
exports.login= function(data) {
        console.log("logging in");

        module.exports.validatepagetitle(title);
        module.exports.sendkeys('email', 'Emailaddress Box', email);
        module.exports.sendkeysid('pass', 'Password Box', password);
        module.exports.clickid('send2', 'Submit Button');

}
