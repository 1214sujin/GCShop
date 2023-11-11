var db = require('./db')
var date = require('./template')	// date.now()

module.exports = {
	view: (req, res) => {
		if (req.session.class == '00') {
			var type = req.params.typeId
			var page = req.params.pNum

		}
		else if (req.session.class == '01') {
		}
		else if (req.session.class == '02') {

		}
		else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},

	detail: (req, res) => {
		if (req.session.class == '00') {

		}
		else if (req.session.class == '01') {
		}
		else if (req.session.class == '02') {

		}
		else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},

	create: (req, res) => {
		if (req.session.class == '01') {
			var type = req.params.typeId
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res) => {},

	update: (req, res) => {
		if (req.session.class == '01') {
			var board = req.params.boardId
			var type = req.params.typeId
			var page = req.params.pNum
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	update_process: (req, res) => {},

	delete: (req, res) => {
		if (req.session.class == '01') {
			var board = req.params.boardId
			var type = req.params.typeId
			var page = req.params.pNum
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	}
}