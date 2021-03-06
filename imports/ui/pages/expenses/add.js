import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import './add.html';

import { Expenses, expenseTypes } from '/imports/api/expenses/expenses.js';

Template.Expenses_add.onCreated(function () {
  Meteor.subscribe('users.all');
  Meteor.subscribe('expenses.all');
});

//const Users = Meteor.users.find();

Template.Expenses_add.helpers({
  /*users() {
    return Users;
  },*/
  Expenses() {
    return Expenses;
  },
  expenseTypes() {
    return expenseTypes;
  },
  distributionData() {
    // Gather the user ids
    Users   = Meteor.users.find({}, { fields: { _id: 1 }, sort: { username: 1 } }).fetch();
    UserIds = Users.map(user => user._id);

    // Prepare them as doc (to serve as default values in the form)
    data = { priceDistribution: [] };
    UserIds.forEach(userId => {
      data.priceDistribution.push({ userId: userId, amount: 0 });
    })
    return data;
  },
  'usernameFromId'(fieldName) {
    //var someValue = AutoForm.getFieldValue(fieldName);
    //console.log(someValue);
    //User = Meteor.users.findOne({ _id: userId }, { fields: { username: 1 } }).fetch();
    return 0;
  },
  activeUsers() {
    // Gather the users
    Users = Meteor.users.find({}, { fields: { _id: 1, username: 1 }, sort: { username: 1 } }).fetch();

    // Return their name and ids such that we can create a decent custom form.
    data = [];
    for(i = 0; i < Users.length; i++) {
      data.push({ 
        username: Users[i].username, 
        userId: Users[i]._id, 
        userIdField: 'priceDistribution.'+i+'.userId', 
        amountField: 'priceDistribution.'+i+'.amount'
      });
    }
    return data;
  }
});

Template.Expenses_add.events({
  /*'keyup'(event) {
    
  },*/
});


Template.Expenses_add.events({

  // Submit form event
  /*'submit .new-expense'(event) {
    event.preventDefault();

    const target   = event.target;
    const allUsers = Users.fetch();

    // Gather the data from the fields
    const price             = target.price.value;
    const date              = target.date.value;
    const description       = target.description.value;
    const type              = target.type.value;
    const priceDistribution = [];

    // Gather the distribution by looping through each user.
    allUsers.forEach(user => {
      payValue = target['user-' + user.username].value;

      // Save some space by only considering users who actually contribute.
      // IMPORTANT: although we use the usernames in the form, id's are 
      // used in the database to identify users.
      if(payValue > 0) {
        entry = {_id: user._id, amount: payValue};
        priceDistribution.push(entry);
      }
    });

    console.log(priceDistribution);

    // Meteor.call('expenses.insert', price, date, description, type, priceDistribution, (error) => {
    //   if (error) {
    //     alert(error.error);
    //   } else {
    //     FlowRouter.go('App.home');
    //   }
    // });
  },*/

  // Increase and decrease button functionality for the chipping in system.
  'click .btn-number' (event, template) {
    // Get the related type (plus or minus) and the field.
    const type = event.target.dataset.type;
    const field = event.target.dataset.field;

    // Get the fields current value and make sure its a legal number.
    var curValue = template.$('#' + field).val();
    curValue = isNaN(curValue) ? 0 : Math.floor(curValue);

    if(type == 'plus') {
      // Increase the number by 1.
      template.$('#' + field).val(++curValue);

      // Make sure that the minus button is enabled.
      template.$('.btn-number[data-type="minus"][data-field="' + field + '"]').removeAttr('disabled');
    }
    else if(type == 'minus') {
      // Make sure that after a 1, always a 0 will come.
      if(curValue <= 1) {
        template.$('#' + field).val(0);

        // And at this end, disable the minus button.
        event.target.setAttribute('disabled', true);
      }
      else {
        template.$('#'+field).val(--curValue);
      }
    }
  }

});
