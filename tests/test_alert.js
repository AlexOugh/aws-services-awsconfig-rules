
/*
export TABLE_NAME=aws-services-awsconfig-DynamoDBTable-1XS5P1XNUG6CR
*/

event = {
  body: null,
}

var i = require('../src/index_alert.js');
var context = {succeed: res => console.log(res), done: res => console.log(res), fail: res => console.log(res)};
i.handler(event, context, function(err, data) {
  if (err)  console.log("failed : " + err);
  else console.log("completed: " + JSON.stringify(data));
});
