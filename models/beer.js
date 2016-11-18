import mongoose from 'mongoose';

const BeerSchema   = new mongoose.Schema({
    name: 		String, // name er av typen String
    brewery: 	String,	// brewery er av typen String
    size:		Number, // size er av typen Number (som i 500 ml)
    alcoholic:	Boolean // alcoholic er av typen Boolean
});

module.exports = mongoose.model('Beer', BeerSchema);