const express = require('express')
var router = express.Router()

var purchase = require('../lib/purchase')
var cart = require('../lib/cart')

// 구매내역
router.get('/', (req, res) => {
	if (req.session.class == '01') res.redirect('/purchase/view/v')
	purchase.home(req, res)
})

router.post('/create', (req, res) => {
	purchase.create_process(req, res)
})
router.get('/cancel/:purId', (req, res) => {
	purchase.cancel_process(req,res)
})

router.get('/view/:vu', (req, res) => {
	purchase.vu(req, res)
})
router.get('/create', (req, res) => {
	purchase.create(req, res)
})
router.get('/update/purId', (req, res) => {
	purchase.update(req, res)
})
router.post('/update_process', (req, res) => {
	purchase.update_process(req, res)
})

// 장바구니
router.get('/cart', (req, res) => {
	if (req.session.class == '01') res.redirect('/purchase/cart/view/v')
	cart.home(req, res)
})

router.post('/cart/create', (req, res) => {
	cart.create_process(req, res)
})

router.get('/cart/view/:vu', (req, res) => {
	cart.vu(req, res)
})
router.get('/cart/create', (req, res) => {
	cart.create(req, res)
})
router.get('/cart/update/purId', (req, res) => {
	cart.update(req, res)
})
router.post('/cart/update_process', (req, res) => {
	cart.update_process(req, res)
})

module.exports = router