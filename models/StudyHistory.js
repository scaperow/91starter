var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User StudyHistory
 * ==========
 */
var StudyHistory = new keystone.List('StudyHistory');

/**
 * StudyHistory Model
 * ==========
 */
StudyHistory.add({
	course: { type: String },
	studyTime: { type: Types.Date, index: true },
	account: { type: Types.Relationship, ref: 'Account' },
});

StudyHistory.defaultColumns = 'course,studyTime,account';
StudyHistory.register();
