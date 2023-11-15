const express = require('express')
var router = express.Router()

var shop = require('../lib/shop')

router.get('/:category', (req, res) => {
	shop.home(req, res)
})

router.get('/detail/:merId', (req, res) => {
	shop.detail(req, res)
})

module.exports = router