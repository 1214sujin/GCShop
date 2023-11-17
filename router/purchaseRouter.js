const express = require('express')
var router = express.Router()

var purchase = require('../lib/purchase')

router.get('/', (req, res) => {
	purchase.home(req, res)
})
router.post('/create', (req, res) => {
	purchase.create_process(req, res)
})
router.get('/cancel/:purId', (req, res) => {
	purchase.cancel_process(req,res)
})

router.get('/cart', (req, res) => {
	purchase.cart(req, res)
})
router.post('/cart/create', (req, res) => {
	purchase.cart_process(req, res)
})

module.exports = router