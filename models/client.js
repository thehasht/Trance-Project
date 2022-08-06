const mongoose = require('mongoose')
const validateIndia = require('validate-india')
const bcrypt = require('bcryptjs')

const clientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
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

}, {
    timestamps: true
})

clientSchema.pre('save', async function (next) {
    const client = this 

    if(client.isModified('password')) {
        client.password = await bcrypt.hash(client.password, 8)
    }

    next()
})

clientSchema.statics.findByCredentials = async function (credentials) {
    const client = await Client.findOne({ aadhar: credentials.aadhar })

    if(!client) {
        throw new Error('Invalid Credentials')
    } 

    const isMatch = await bcrypt.compare(credentials.password, client.password)

    if(!isMatch) {
        throw new Error('Invalid Credentials')
    }

    return client
}

const Client = mongoose.model('Client', clientSchema)

module.exports = {
    Client
}
