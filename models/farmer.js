const mongoose = require('mongoose')
const validateIndia = require('validate-india')
const bcrypt = require('bcryptjs')

const farmerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    rating: {
        type: Number,
        default: 0
    },

    pan: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        validator (value) {
            if(!validateIndia.pan.isValid(value)) {
                throw new Error('Invalid PAN')
            }
        }
    },

    aadhar: {
        type: Number,
        required: true,
        trim: true,
        validator (value) {
            if(!validateIndia.aadhaar(value)) {
                throw new Error('Invalid Aadhar')
            }
        }
    },

    contact: {
        type: String, 
        required: true,
        trim: true,
        validator (value) {
            if(value.length != 10) {
                throw new Error('Invalid Contact')
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validator (value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid.')
            }
        }
    },

    location: {
        type: String,
        required: true,
        trim: true,
    },

    warehouselocation: {
        type: String,
        required: true
    },

    pickuptimings: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

farmerSchema.pre('save', async function (next) {
    const farmer = this 

    if(farmer.isModified('password')) {
        farmer.password = await bcrypt.hash(farmer.password, 8)
    }

    next()
})

farmerSchema.statics.findByCredentials = async function (credentials) {
    const farmer = await Farmer.findOne({ pan: credentials.pan })

    if(!farmer) {
        throw new Error('Invalid Credentials')
    } 

    const isMatch = await bcrypt.compare(credentials.password, farmer.password)

    if(!isMatch) {
        throw new Error('Invalid Credentials')
    }

    return farmer
}

const Farmer = mongoose.model('Farmer', farmerSchema)

module.exports = {
    Farmer
}