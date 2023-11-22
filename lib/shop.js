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
				req.app.render('home', context, (err, html) => {
					if (err) console.log(err)
					res.send(html)
				})
			})
		})
	},

	search: (req, res) => {
		var kw = urlm.parse(req.url, true).query.kw
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
	},

	purchase: (req, res) => {
		var mer_id = req.params.merId
		menu.menubar(req, (menubar) => {
			db.query('select * from merchandise where mer_id=?', [mer_id], (err, item) => {
				context = {
					menu: menubar,
					body: 'merchandiseDetail.ejs',
					item: item[0],
					loginid: req.session.loginid,
					purchase: 'Y'
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},
	customeranal: (req, res) => {
		if (req.session.class == '00') {
			menu.menubar(req, menubar => {
				db.query('select address, round( (count(*)/(select count(*) from person))*100, 2) as rate from person group by address', (err, results) => {
					var context = {
						menu: menubar,
						body: 'customerAnal.ejs',
						percentage: results
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		} else {
			res.redirect('/shop/all')
		}
	},
	meranal: (req, res) => {
		if (req.session.class == '00') {
			menu.menubar(req, menubar => {
				sql1 = `select name, m.mer_id, cnt from merchandise m left join (select mer_id, sum(n) as cnt
							from (select mer_id, count(*)*qty as n from purchase where cancel='N' group by mer_id, qty) as s group by mer_id) s
						on m.mer_id=s.mer_id;`
				sql2 = `select max(cnt) as max from (select mer_id, sum(n) as cnt
							from (select mer_id, count(*)*qty as n from purchase where cancel='N' group by mer_id, qty) as s
						group by mer_id) as ss`
				db.query(sql1+sql2, (err, results) => {
					var context = {
						menu: menubar,
						body: 'merAnal.ejs',
						data: results[0],
						max: results[1][0].max
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		} else {
			res.redirect('/shop/all')
		}
	}
}