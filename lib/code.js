var db = require('./db')
var menu = require('./menu')

module.exports = {
	view: (req, res) => {
		var vu = req.params.vu
		menu.menubar(req, (menubar) => {
			db.query('select * from code_tbl', (err, codes) => {
				if (err) console.log(err)
				if (req.session.class == '01') {
					if (vu == 'v') {
						var u = false
					} else if (vu == 'u') {
						var u = true
					} else {
						res.send('잘못된 접근입니다. 뒤로 돌아가 다시 시도하세요.')
					}
				} else {
					res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
				}
				var context = {
					menu: menubar,
					body: 'code.ejs',
					code: codes,
					isU: u
				}
				req.app.render('home', context, (err, html) => res.end(html))
			})
		})
	},

	create: (req, res) => {
		if (req.session.class == '01') {
			menu.menubar(req, (menubar) => {
				var context = {
					menu: menubar,
					body: 'codeCU.ejs'
				}
				req.app.render('home', context, (err, html) => res.end(html))
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res) => {
		var post = req.body
		db.query('insert into code_tbl (main_id, main_name, sub_id, sub_name, start, end) values(?, ?, ?, ?, ?, ?)',
				[post.main_id, post.main_name, post.sub_id, post.sub_name, post.start, post.end], (err, result) => {
			res.redirect('/code/view/v')
		})
	},

	update: (req, res) => {
		if (req.session.class == '01') {
			var main_id = req.params.main
			var sub_id = req.params.sub
			menu.menubar(req, (menubar) => {
				db.query('select * from code_tbl where main_id=? and sub_id=?', [main_id, sub_id], (err, result) => {
					var context = {
						menu: menubar,
						body: 'codeCU.ejs',
						code: result,
						main_id: main_id,
						sub_id: sub_id
					}
					req.app.render('home', context, (err, html) => res.end(html))
				})
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	update_process: (req, res) => {
		var post = req.body
		db.query('update code_tbl set main_name=?, sub_name=?, start=?, end=? where main_id=? and sub_id=?',
			[post.main_name, post.sub_name, post.start, post.end, post.main_id, post.sub_id], (err, result) => {
			res.redirect('/code/view/u')
		})
	},

	delete_process: (req, res) => {
		if (req.session.class == '01') {
			var main_id = req.params.main
			var sub_id = req.params.sub
			db.query('select * from code_tbl join merchandise on sub_id=category where main_id=? and sub_id=?', [main_id, sub_id], (err, result) => {
				if (result == '') {
					db.query('delete from code_tbl where main_id=? and sub_id=?', [main_id, sub_id], (err, result) => {
						res.redirect('/code/view/u')
					})
				} else {
					res.send(`<script>alert('해당 코드를 삭제할 수 없습니다.'); location.href='/code/view/u'</script>`)
				}
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	}
}