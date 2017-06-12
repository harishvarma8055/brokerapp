Meteor.publish("customerdetails", function () {
  return CustomerDetails.find({});
});