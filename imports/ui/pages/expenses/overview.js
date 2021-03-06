import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './overview.html';

import { Users } from '/imports/api/users/users.js';
import { Expenses } from '/imports/api/expenses/expenses.js';
import { BalanceEntries } from '/imports/api/balance-entries/balance-entries.js';

Template.Expenses_overview.onCreated(function () {
  Meteor.subscribe('users.all');
  Meteor.subscribe('expenses.all');
  Meteor.subscribe('balanceentries.all');

  //var tempUsers = Meteor.users.find({}, { fields: { _id: 1 } }).fetch();
  //console.log(BalanceEntries.find());
  //console.log(BalanceEntries.balance())
});

Template.Expenses_overview.helpers({
  'formatDate'(date) {
    return moment(date).format('dd DD MMM');
  },
  'formatPrice'(price) {
    return numeral(price).format('$0.00');
  },
  'correspondingValue'(userId, distribution) {
    amount = '';

    distribution.forEach(entry => {
      if(entry.userId === userId) {
        amount = entry.amount;
      }
    });
    return amount;
  },
  'isSelf'(userId) {
    if(userId === Meteor.userId()) {
      return 'table-active';
    }
    return '';
  },
  'isOwner'(userId, ownerId) {
    if(userId === ownerId) {
      return 'table-primary';
    }
    return '';
  },
  expenses() {
    return Expenses.find();
  },
  users() {
    return Users.find({}, { sort: { username: 1 } });
  },
});
