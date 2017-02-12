var fs = require('fs');

var usersPath = __dirname + '/users';

var users = {};

fs.readdir(usersPath, function(err, items) {
  console.log('Files found', items);
  for (var i = 0; i < items.length; i++) {
    console.log(items[i]);
    var contents = fs.readFileSync(usersPath + '/' + items[i], 'utf8');
    addOrUpdateUser(JSON.parse(contents));
  }
});

function addOrUpdateUser(userObj) {
  users[userObj] = userObj;
  return users;
}

function findUserByPhone(phoneNumber){
  var ans;
  for (var id in users) {
    if (users.hasOwnProperty(id)) {
      if(users[id].phoneNumber && users[id].phoneNumber == phoneNumber){
        ans = users[id];
        break;
      }
    }
  }    
  return ans;
}

module.exports = {
  addOrUpdateUser: addOrUpdateUser,
  findUserByPhone: findUserByPhone,
  users: users
};
