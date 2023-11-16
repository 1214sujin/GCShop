var db = require('./db')
var menu = require('./menu')

module.exports = {
	view: (req, res) => {
		var vu = req.params.vu
		menu.menubar(req, (menubar) => {
			db.query('select * from merchandise', (err, items) => {
				if (err) console.log(err)
				if (req.session.class == '01') {	// 관리자가 아닌 사람이 url을 통해 접근할 수 없음
					if (vu == 'v') {
						var u = undefined
					} else if (vu == 'u') {
						var u = true
					} else {	// 관리자가 url로 접근시 vu에 오타를 낸 경우
						res.send('잘못된 접근입니다. 뒤로 돌아가 다시 시도하세요.')
					}
				} else {
					res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
				}
				var context = {
					menu: menubar,
					body: 'merchandise.ejs',
					item: items,
					isU: u
				}
				req.app.render('home', context, (err, html) => res.end(html))
			})
		})
	},

	create: (req, res) => {
		if (req.session.class == '01') {
			db.query(`select * from code_tbl where main_id='0000'`, (err, category) => {
				menu.menubar(req, (menubar) => {
					var context = {
						menu: menubar,
						body: 'merchandiseCU.ejs',
						list: category
					}
					req.app.render('home', context, (err, html) => res.end(html))
				})
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res, file) => {
		var post = req.body
		if (file == 'No') { file = '/images/noImage.png' }
		db.query('insert into merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[post.category, post.name, post.price, post.stock, post.brand, post.supplier, file, post.sale_yn, post.sale_price], (err, result) => {
			res.redirect('/merchandise/view/v')
		})
	},

	update: (req, res) => {
		if (req.session.class == '01') {
			menu.menubar(req, (menubar) => {
				var id = req.params.merId
				sql1 = `select * from code_tbl where main_id='0000';`
				sql2 = 'select * from merchandise where mer_id=?'
				db.query(sql1+sql2, [id], (err, subIds) => {
					if (err) console.log(err)
					var context = {
						menu: menubar,
						body: 'merchandiseCU.ejs',
						list: subIds[0],
						mer: subIds[1],
						id: id
					}
					req.app.render('home', context, (err, html) => res.end(html))
				})
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	update_process: (req, res, file) => {
		var post = req.body
		if (file == 'No') {
			db.query('update merchandise set category=?, name=?, price=?, stock=?, brand=?, supplier=?, sale_yn=?, sale_price=? where mer_id=?',
					[post.category, post.name, post.price, post.stock, post.brand, post.supplier, post.sale_yn, post.sale_price, post.id], (err, result) => {
				res.redirect('/merchandise/view/u')
			})
		} else {
			db.query('update merchandise set category=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=? where mer_id=?',
					[post.category, post.name, post.price, post.stock, post.brand, post.supplier, file, post.sale_yn, post.sale_price, post.id], (err, result) => {
				res.redirect('/merchandise/view/u')
			})
		}
	},

	delete_process: (req, res) => {
		if (req.session.class == '01') {
			var id = req.params.merId
			db.query('delete from merchandise where mer_id=?', [id], (err, result) => {
				res.redirect('/merchandise/view/u')
			})
		} else {
			res.send(`<script>alert('관리자 로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	}
}