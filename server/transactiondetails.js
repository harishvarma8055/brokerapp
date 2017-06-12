Meteor.publish("transactiondetails", function () {
  return TransactionDetails.find({});
});