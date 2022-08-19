const mongoose  =   require('mongoose');
const { Schema }  =   mongoose;

const CartSchema = new Schema({
    user_id:          { type: String, required: true},
    product_id:       { type: String, required: true},
});

module.exports = mongoose.model('Cart', CartSchema)
