var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var Account = new keystone.List('Account');

Account.add({
    name: { type: Types.Name, required: true, index: true },
    password: { type: Types.Password, initial: true, required: true },
    balance: { type: Number, initial: true, require: true },
    consume: { type: Number, initial: true, require: true }
});

// Provide access to Keystone
Account.schema.virtual('cost').get(function () {
    return this.consume - balance;
});

/**
 * Registration
 */
Account.defaultColumns = 'name, balance';
Account.register();
