var db = require('./db')
var menu = require('./menu')

module.exports = {
	view: (req, res) => {
		if (req.session.class == '01') {
			menu.menubar(req, (menubar) => {
				db.query('select * from boardtype', (err, types) => {
					var context = {
						menu: menubar,
						body: 'boardtype.ejs',
						types: types
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},

	create: (req, res) => {
		if (req.session.class == '01') {
			menu.menubar(req, (menubar) => {
				var context = {
					menu: menubar,
					body: 'boardtypeCU.ejs',
					cu: 'C'
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res) => {
		var post = req.body
		db.query('insert into boardtype (title, description, write_YN, re_YN, numPerPage) values(?,?,?,?,?)',
				[post.title, post.description, post.write_YN, post.re_YN, post.numPerPage], (err, result) => {
			res.redirect('/board/type/view')
		})
	},

	update: (req, res) => {
		if (req.session.class == '01') {
			var type = req.params.typeId
			menu.menubar(req, (menubar) => {
				db.query('select * from boardtype where type_id=?', [type], (err, result) => {
					var context = {
						menu: menubar,
						body: 'boardtypeCU.ejs',
						boardtype: result,
						cu: 'U'
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	update_process: (req, res) => {
		var post = req.body
		console.log(post.type_id)
		db.query('update boardtype set title=?, description=?, write_YN=?, re_YN=?, numPerPage=? where type_id=?',
			[post.title, post.description, post.write_YN, post.re_YN, post.numPerPage, post.type_id], (err, result) => {
			res.redirect('/board/type/view')
		})
	},

	delete_process: (req, res) => {
		if (req.session.class == '01') {
			var type_id = req.params.typeId
			db.query('delete from boardtype where type_id=?', [type_id], (err, result) => {
				res.redirect('/board/type/view')
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	}
}