var db = require('./db')
var menu = require('./menu')

module.exports = {
	login: (req, res) => {
		menu.menubar(req, (menubar) => {
			var context = {
				menu: menubar,
				body: 'login.ejs'
			}
			req.app.render('home', context, (err, html) => res.end(html))
		})
	},
	login_process: (req, res) => {
		var post = req.body

		db.query('select count(*) as num from person where loginid=? and password=?', [post.id, post.pwd], (err, results) => {
			if (results[0].num === 1) {
				db.query('select loginid, name, class from person where loginid=? and password=?', [post.id, post.pwd], (err, result) => {
					req.session.is_logined = true
					req.session.name = result[0].name
					req.session.class = result[0].class
					req.session.loginid = result[0].loginid
					// res.redirect('/')	// 왜인지 navbar가 바로 업데이트되지 않음.
					res.send(`<script>location.href='/'</script>`)
				})
			} else {
				res.send(`<script>
					alert("아이디 또는 비밀번호가 올바르지 않습니다.")
					location.href='/auth/login'
					</script>`)
			}
		})
	},
	logout_process: (req, res) => {
		req.session.destroy((err) => {
			res.redirect('/')
		})
	},

	signup: (req, res) => {
		menu.menubar(req, (menubar) => {
			var context = {
				menu: menubar,
				body: 'signup.ejs'
			}
			req.app.render('home', context, (err, html) => res.end(html))
		})
	},
	signup_process: (req, res) => {
		var post = req.body
		db.query('insert into person(loginid, password, name, address, tel, birth, class, point) values(?, ?, ?, ?, ?, ?, ?, 0)',
				[post.login_id, post.password, post.name, post.address, post.tel, post.birth, '02'], (err, result) => {
			res.redirect('/auth/login')
		})
	}
}