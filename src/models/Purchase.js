const mongoose  =   require('mongoose');
const { Schema }  =   mongoose;

const PurchaseSchema = new Schema({
    list:           { type: String, required: true},
    price:          { type: Number, required: true},
    user_id:         { type: String, required: true},
    date:           { type: Date,   default:  Date.now}
});

module.exports = mongoose.model('Purchase', PurchaseSchema)