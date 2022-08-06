const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({

    farmerPAN: {
        type: String,
        required: true,
        trim: true
    },

    product: {
        type: String,
        required: true,
        trim: true
    },

    quantity: {
        type: Number,
        required: true,
        trim: true,
        validator (value) {
            if (value < 0) {
                throw new Error('Invalid Quantity')
            }
        }
    },

    price: {
        type: Number,
        required: true,
        trim: true,
        validator (value) {
            if(value < 0) {
                throw new Error('Invalid Price')
            }
        }
    }

}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = {
    Product
}