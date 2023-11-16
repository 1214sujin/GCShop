var db = require('./db')
var menu = require('./menu')
var urlm = require('url')

module.exports = {
	home: (req, res) => {
		var category = req.params.category
		menu.menubar(req, (menubar) => {
			if (category == 'all') {
				var sql1 = 'select * from merchandise'
			} else {
				var sql1 = `select * from merchandise where category=${category}`
			}
			db.query(sql1, (err, items) => {
				var context = {
					menu: menubar,
					body: 'merchandise.ejs',
					item: items,
					isU: false
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	search: (req, res) => {
		var kw = urlm.parse(req.url, true).query.kw
		console.log(kw)
		menu.menubar(req, (menubar) => {
			db.query(`select * from merchandise where name like '%${kw}%' or \
			brand like '%${kw}%' or supplier like '%${kw}%'`, (err, items) => {
				context = {
					menu: menubar,
					body: 'merchandise.ejs',
					item: items
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	detail: (req, res) => {
		var mer_id = req.params.merId
		menu.menubar(req, (menubar) => {
			db.query('select * from merchandise where mer_id=?', [mer_id], (err, item) => {
				context = {
					menu: menubar,
					body: 'merchandiseDetail.ejs',
					item: item[0],
					loginid: req.session.loginid
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	}
}