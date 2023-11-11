var db = require('./db')
var menu = require('./menu')

module.exports = {
	view: (req, res) => {
		var vu = req.params.vu
		menu.menubar(req, (menubar) => {
			db.query('select * from person', (err, people) => {
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
					body: 'person.ejs',
					person: people,
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
					body: 'personCU.ejs'
				}
				req.app.render('home', context, (err, html) => res.end(html))
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res) => {
		var post = req.body
		db.query('insert into person (loginid, password, name, address, tel, birth, class, point) values(?, ?, ?, ?, ?, ?, ?, 0)',
				[post.login_id, post.password, post.name, post.address, post.tel, post.birth, post.class], (err, result) => {
			res.redirect('/person/view/v')
		})
	},

	update: (req, res) => {
		if (req.session.class == '01') {
			var login_id = req.params.loginId
			menu.menubar(req, (menubar) => {
				db.query('select * from person where loginid=?', [login_id], (err, result) => {
					var context = {
						menu: menubar,
						body: 'personCU.ejs',
						person: result,
						login_id: login_id
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
		db.query('update person set name=?, address=?, tel=?, birth=?, class=?, point=? where loginid=?',
			[post.name, post.address, post.tel, post.birth, post.class, post.point, post.login_id], (err, result) => {
			res.redirect('/person/view/u')
		})
	},

	delete_process: (req, res) => {
		if (req.session.class == '01') {
			var login_id = req.params.loginId
			db.query('select * from person where loginid=?', [login_id], (err, result) => {
				if (result[0].loginid != req.session.loginid) {
					db.query('delete from person where loginid=?', [login_id], (err, result) => {
						res.redirect('/person/view/u')
					})
				} else {
					res.send(`<script>alert('현재 접속 중인 계정을 삭제할 수 없습니다.'); location.href='/person/view/u'</script>`)
				}
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	}
}