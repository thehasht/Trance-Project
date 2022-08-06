require('./db/mongoose')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const store = require('store')

const { Product } = require('./models/product')
const { Farmer } = require('./models/farmer')
const { Client } = require('./models/client')

const app = express()

const publicDirectoryPath = path.join(__dirname, '/public')

app.use(express.static(publicDirectoryPath))

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.post('/farmer-signin-temp', (req, res) => {
    res.status(200).redirect('/farmer-signin')
})

app.get('/farmer-signin', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/farmer.html'))
})

app.post('/farmer-signin', urlencodedParser, async function(req, res) {
    const farmer = new Farmer({
        name: req.body.name,
        pan: req.body.pan,
        aadhar: req.body.aadhar,
        contact: req.body.contact,
        password: req.body.password,
        location: req.body.location,
        warehouselocation: 'harshits house',
        pickuptimings: '12:00'
    })

    try {
        await farmer.save()
        res.status(200).redirect('/farmer-midpage?pan=' + farmer.pan)
    } catch (error) {
        res.status(400).send({ error })
    }
})

app.get('/farmer-login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/farmerLogin.html'))
})

app.post('/farmer-login', urlencodedParser, async function(req, res) {
    try {
        const farmer = await Farmer.findByCredentials({
            pan: req.body.pan,
            password: req.body.password
        })
        res.status(200).redirect('/farmer-midpage?pan=' + farmer.pan)
    } catch (error) {
        res.status(400).send({ error })
    }
})

app.get('/farmer-midpage', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/farmerMidPage.html'))
})

app.post('/farmer-profile-temp', async function(req, res) {
    try {
        const farmer = await Farmer.findOne({ pan: req.query.pan })
        res.status(200).redirect('/farmer-profile?name=' + farmer.name + '&rating=' + farmer.rating
        + '&location=' + farmer.location + '&warehouselocation=' + farmer.warehouselocation + '&pickuptimings='
        + farmer.pickuptimings)

    } catch (error){
        throw new Error({ error })
    }
})

app.post('/farmer-product-temp', urlencodedParser, (req, res) => {
    res.status(200).redirect('/farmer-product?pan=' + req.query.pan)
})

app.get('/farmer-profile', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/farmerProfile.html'))
})

app.get('/farmer-product', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/farmerProduct.html'))
})

app.post('/farmer-product', urlencodedParser, async function (req, res){
    const pan = req.query.pan

    const product = new Product({
        farmerPAN: pan,
        product: req.body.product,
        quantity: req.body.quantity,
        price: req.body.price
    })

    try {
        await product.save()
        res.status(200).redirect('/farmer-product')
    } catch(error) {
        res.status(400).send({ error })
    }
})

app.post('/client-signin-temp', (req, res) => {
    res.status(200).redirect('/client-signin')
})

app.get('/client-signin', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/client.html'))
})

app.post('/client-signin', urlencodedParser, async function(req, res){
    const client = new Client({
        name: req.body.name,
        aadhar: req.body.aadhar,
        contact: req.body.contact,
        password: req.body.password,
        location: req.body.location
    })

    try {
        await client.save()
        res.status(200).redirect('/client-midpage?aadhar=' + client.aadhar)
    } catch(error) {
        throw new Error({ error })
    }
})

app.get('/client-login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/clientLogin.html'))
})

app.post('/client-login', urlencodedParser, async function (req, res) {
    try {
        const client = await Client.findByCredentials({
            aadhar: req.body.aadhar,
            password: req.body.password
        })
        res.status(200).redirect('/client-midpage?aadhar=' + client.aadhar)
    } catch (error) {
        throw new Error({ error })
    }
})

app.get('/client-midpage', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/clientMidPage.html'))
})

app.post('/client-profile-temp', async function(req, res){
    try {
        const client = await Client.findOne({ aadhar: req.query.aadhar })
        res.status(200).redirect('/client-profile?name=' + client.name + '&aadhar=' + client.aadhar + 
        '&contact=' + client.contact + '&location=' + client.location)
    } catch(error) {
        throw new Error({ error })
    }
})

app.get('/client-profile', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/clientProfile.html'))
})

app.post('/client-product-temp', urlencodedParser, (req, res) => {
    res.status(200).redirect('/client-product?aadhar=' + req.query.aadhar)
})

app.get('/client-product', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/clientProduct.html'))
})

app.post('/client-product', urlencodedParser,async function(req, res){
    console.log(req.body.product)
    const product = req.body.product
    try {
        const results = await Product.find({ product })
        console.log(results)
    } catch(error) {
        throw new Error({ error })
    }
})

app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})