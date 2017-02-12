var express = require('express');
var router = express.Router();
var fs = require('fs');
var FlowrouteSMS = require('flowroute-sms');

var flowrouteAccessKey = '43584401';
var flowrouteSecretKey = '760f91afaecd3e620a8c9e09e8fc943a';


function getUserInstallEventData(userId){
  var fileName = __dirname + "/../users/" + userId;
  var contents = fs.readFileSync(fileName, 'utf8');
  return JSON.parse(contents);
}

router.get('/config', function(req, res, next) {
  console.log('Config called');
  console.log('Config called with req.query:', req.query);
  console.log('Config called locals:', res.locals);
  //TODO: Do not hardcode userId, get it from 
  res.render('config', {userId: 'u:qq4q2w4q4vziqe24'});
});

router.post('/config', function(req, res, next) {
  console.log('Saving config. Req Body = ', req.body) ;
  
  var installObj = getUserInstallEventData(req.body.userId);
  console.log('Updating install obj', installObj);
  
  installObj.phoneNumber = req.body.phoneNumber;
  installObj.flowrouteSecret = req.body.flowrouteSecret;
  installObj.flowrouteKey = req.body.flowrouteKey;

  var fileName = __dirname + "/../users/" + req.body.userId;
  console.log('Saving install event in file:', fileName);
  fs.writeFile(fileName, JSON.stringify(installObj, null, 2), function(err) {
    if(err) {
      console.log('Error saving install event: ' + err);
      res.send('Error saving install event: ' + err);
    }else{
      req.userData.addOrUpdateUser(installObj);
      console.log("The file was saved!");
      res.send('User install event is saved!');
    }
  });
});


// router.post('/sms', function(req, res, next) {
//   res.send('OK from /sms');
// });


/* GET users listing. */
router.post('/event', function(req, res, next) {
  console.log('Event received from Flock:', req.body);
  console.log('res.locals', res.locals);
  
  if(req.body.name == 'app.install'){
    var fileName = __dirname + "/../users/" + req.body.userId;
    console.log('Saving install event in file:', fileName);
    fs.writeFile(fileName, JSON.stringify(req.body, null, 2), function(err) {
      if(err) {
        console.log('Error saving install event: ' + err);
        res.send('Error saving install event: ' + err);
      }else{
        console.log("The file was saved!");
        res.send('User install event is saved!');
        
        
      }
    });   
  }else if(req.body.name == 'app.uninstall'){
    var fileName = __dirname + "/../users/" + req.body.userId;
    console.log('Deleting uninstall user file:', fileName);
    fs.unlink(fileName, function(err) {
      if(err) {
        console.log('Error deleting uninstall file: ' + err);
        res.send('Error deleting uninstall file: ' + err);
      }else{
        console.log("The file was deleted!");
        res.send('The file was deleted!');
      }
    });   
  }else if(req.body.name == 'chat.receiveMessage' && req.body.message.from == 'u:Btk2haalkkhzzelf'){
    console.log('Got message from bot!');    
    
    //console.log('Finding install data for user:', req.body.userId);
    
    //curl -d token=f7a29c2c-1e99-4bd4-9597-39f97e8d9fce -d to=u:qq4q2w4q4vziqe24 -d text=Hitheree  "https://api.flock.co/v1/chat.sendMessage"


    //var installData = getUserInstallEventData(req.body.userId);
    //console.log('Install data file:', installData);
    //installData.userToken
    req.flock.callMethod('chat.sendMessage', "f7a29c2c-1e99-4bd4-9597-39f97e8d9fce", {
      to: 'u:qq4q2w4q4vziqe24',
      text: req.body.message.text
    }, function(error, response) {
      if (error) {
        console.log('Error sending SMS message:', error);
      }else{
        console.log('Response of sending SMS message:', response);
      }
    });    

    res.json({text: 'OKKKK'});    
  }else if(req.body.name == 'client.slashCommand'){
    console.log('Handling client.slashCommand...');

    var splitted = req.body.text.split(" ");
    var toPhone = splitted[0].toLowerCase();
    splitted.shift();
    var txtMessage = splitted.join(" ");    
    
    console.log('Sending message to: ', toPhone);
    console.log('Sending message txt: ', txtMessage);
    
    //TODO: Get user obj by req.body.userId and there should be keys 
    
    var userObj = getUserInstallEventData(req.body.userId);
    console.log('User Obj: ', userObj);
    
    if(userObj){
      
      //sms 15107098865 What is this?
      
      //sms 14152548130 What is this?

      var flowrouteClient = new FlowrouteSMS(userObj.flowrouteKey, userObj.flowrouteSecret);
      
      var fromPhone = userObj.phoneNumber;

      flowrouteClient.send(toPhone, fromPhone, txtMessage).then(function(result){
        console.log('Sent message',result.id);
        res.json({text: 'Message sent!'});    
      });    
      
    }else{
      res.json({text: 'You have not set your Flowroute Keys in the config'});    
    }

  }else{
    res.send('All OK');
  }

  
});

module.exports = router;
