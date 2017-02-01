//chandra
exports.handler = function (event, context) {

  var aws_sts = new (require('../lib/aws/sts'))();
  var aws_config = new (require('../lib/aws/awsconfig.js'))();
  var aws  = require("aws-sdk");

  if (!event.federateRoleName)  event.federateRoleName = "federate";

  var roles = [];
  if (event.federateAccount) {
    roles.push({roleArn:'arn:aws:iam::' + event.federateAccount + ':role/' + event.federateRoleName});
    var admin_role = {roleArn:'arn:aws:iam::' + event.account + ':role/' + event.roleName};
    if (event.roleExternalId) {
      admin_role.externalId = event.roleExternalId;
    }
    roles.push(admin_role);
  }
  console.log(roles);

  var sessionName = event.sessionName;
  if (sessionName == null || sessionName == "") {
    sessionName = "session";
  }

  function succeeded(input) { context.done(null, true); }
  function failed(input) { context.done(null, false); }
  function errored(err) { context.fail(err, null); }

  console.log(event);
  var input = {
      sessionName: sessionName,
      roles: roles,
      region: event.region,
      ruleName: event.ruleName
  };

  var flows = [
      {func:aws_sts.assumeRoles, success:aws_config.deleteRules, failure:failed, error:errored},
      {func:aws_config.deleteRules, success:succeeded, failure:failed, error:errored},
  ];

  aws_config.flows = flows;
  aws_sts.flows = flows;

  flows[0].func(input);
};
