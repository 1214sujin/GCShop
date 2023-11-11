const express = require('express')
var router = express.Router()

var board = require('../lib/boardType')

router.get('/view', (req, res) => {
	board.view(req, res)
})

router.get('/create', (req, res) => {
	board.create(req, res)
})
router.post('/create_process', (req, res) => {
	board.create_process(req, res)
})

router.get('/update/:typeId', (req, res) => {
	board.update(req, res)
})
router.post('/update_process', (req, res) => {
	board.update_process(req, res)
})

router.get('/delete/:typeId', (req, res) => {
	board.delete_process(req, res)
})

module.exports = router