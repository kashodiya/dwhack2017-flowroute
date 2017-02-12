var express = require('express');
var router = express.Router();
var fs = require('fs');

//curl -d token=f7a29c2c-1e99-4bd4-9597-39f97e8d9fce -d to=u:qq4q2w4q4vziqe24 -d text=Hitheree  "https://api.flock.co/v1/chat.sendMessage"


router.post('/gotSms', function(req, res, next) {
  try{
    console.log('gogSms BODY = ', req.body);
    
    var user = req.userData.findUserByPhone(req.body.to);
    if(user){
      //console.log('req.flock = ', req.flock);
      req.flock.callMethod('chat.sendMessage', 'f7a29c2c-1e99-4bd4-9597-39f97e8d9fce', {
        to: user.userId,
        text: '[SMS from ' + req.body.from + '] '+ req.body.body
      }, function(error, response) {
        if (error) {
          console.log('Error sending message:', error);
        }else{
          console.log('Response of sending message:', response);
        }
      });    
      res.send('OK gotSms, body is = ');
    }else{
      res.send('Can not find a user having this phone: ', req.body.to);
    }
  }catch(e){
    console.log('Exception', e);    
    res.send(e);
  }
});


module.exports = router;
