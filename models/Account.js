var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Account = new keystone.List('Account');

Account.add({
    name: { type: String, required: true, index: true },
    password: { type: Types.Password, initial: true},
    balance: { type: Number, initial: true, require: true }
});

/**
 * Relationships
 */
Account.relationship({ ref: 'StudyHistory', path: 'studyhistorys', refPath: 'account' });


/**
 * Registration
 */
Account.defaultColumns = 'name,balance';
Account.register();
