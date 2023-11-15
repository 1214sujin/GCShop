const express = require('express')
var router = express.Router()

var board = require('../lib/board')

router.get('/view/:typeId/:pNum', (req, res) => {
	board.view(req, res)
})

router.get('/detail/:boardId/:pNum', (req, res) => {
	board.detail(req, res)
})

router.get('/create/:typeId', (req, res) => {
	board.create(req, res)
})
router.post('/create_process', (req, res) => {
	board.create_process(req, res)
})

router.get('/update/:boardId/:typeId/:pNum', (req, res) => {
	board.update(req, res)
})
router.post('/update_process', (req, res) => {
	board.update_process(req, res)
})

router.get('/delete/:boardId/:typeId/:pNum', (req, res) => {
	board.delete_process(req, res)
})

router.post('/reply/create_process', (req, res) => {
	board.reply_create_process(req, res)
})
router.post('/reply/delete', (req, res) => {
	board.reply_delete_process(req, res)
})

module.exports = router