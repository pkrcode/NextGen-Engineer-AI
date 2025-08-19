const mongoose = require('mongoose');

const salaryBandSchema = new mongoose.Schema({
	region: { type: String, default: 'Global' },
	currency: { type: String, default: 'USD' },
	min: { type: Number, default: 40000 },
	max: { type: Number, default: 120000 }
}, { _id: false });

const skillSchema = new mongoose.Schema({
	name: { type: String, required: true },
	level: { type: String, enum: ['basic', 'intermediate', 'advanced'], default: 'basic' }
}, { _id: false });

const careerRoleSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	domain: { type: String, required: true, trim: true },
	description: { type: String, trim: true },
	lead: { type: String, trim: true },
	skills: [skillSchema],
	responsibilities: [String],
	salaryBands: [salaryBandSchema],
	demandIndex: { type: Number, min: 0, max: 100, default: 60 },
	relatedRoles: [String],
	tags: [String],
	isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

careerRoleSchema.index({ domain: 1, title: 1 }, { unique: true });
careerRoleSchema.index({ isFeatured: 1, demandIndex: -1 });

module.exports = mongoose.model('CareerRole', careerRoleSchema);


