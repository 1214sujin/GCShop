const express = require('express')
var router = express.Router()

var shop = require('../lib/shop')

router.get('/', (req, res) => {
	res.redirect('/shop/all')
})

module.exports = router