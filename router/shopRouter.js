const express = require('express')
var router = express.Router()

var shop = require('../lib/shop')

router.get('/:category', (req, res, next) => {
	if (req.params.category == 'search') {next()}
	shop.home(req, res)
})

router.get('/detail/:merId', (req, res) => {
	shop.detail(req, res)
})

router.get('/search', (req, res) => {
	shop.search(req, res)
})

module.exports = router