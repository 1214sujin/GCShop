var db = require('./db')
var menu = require('./menu')
var date = require('./template')

module.exports = {
	home: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select image, name, p.price, qty, total, date, cancel, purchase_id from purchase p join merchandise m on p.mer_id=m.mer_id where p.loginid=? order by purchase_id desc',
						[req.session.loginid], (err, list) => {
				context = {
					menu: menubar,
					body: 'purchase.ejs',
					list: list
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},
	
	create_process: (req, res) => {
		var post = req.body
		if (post.cart_id) {	// cart에서 넘어오는 경우
			post.qty = post.qty.map(Number)
			for (let i=0; i<post.cart_id.length; i++) {
				if (post.qty[i]) {
					db.query('delete from cart where cart_id=?', [post.cart_id[i]], (err, result) => {
						db.query('insert into purchase (loginid, mer_id, date, price, point, qty, total) values(?,?,?,?,?,?,?)',
								[req.session.loginid, post.mer_id[i], date.now(), post.price[i], post.price[i]*0.5, post.qty[i], post.price[i]*post.qty[i]], (err, result) => {

						})
					})
				}
			}
			res.redirect('/purchase')
		} else {
			db.query('insert into purchase (loginid, mer_id, date, price, point, qty, total) values(?,?,?,?,?,?,?)',
					[req.session.loginid, post.mer_id, date.now(), post.price, post.price*0.5, post.qty, post.price*post.qty], (err, result) => {
				res.redirect('/purchase')
			})
		}
	},
	cancel_process:(req, res) => {
		var purchase_id = req.params.purId
		db.query(`update purchase set cancel='Y' where purchase_id=?`, [purchase_id], (err, result) => {
			res.redirect('/purchase')
		})
	},
	
	vu: (req, res) => {
		var vu = req.params.vu
		menu.menubar(req, (menubar) => {
			db.query('select image, name, p.price, qty, total, date, cancel, purchase_id, loginid from purchase p join merchandise m on p.mer_id=m.mer_id order by purchase_id desc', (err, list) => {
				context = {
					menu: menubar,
					body: 'purchase.ejs',
					list: list,
					isU: vu
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	create: (req, res) => {
		menu.menubar(req, menubar => {
			db.query('select mer_id, name from merchandise', (err, items) => {
				context = {
					menu: menubar,
					body: 'purchaseCU.ejs',
					items: items,
					cu: 'c'
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	update: (req, res) => {
		var pur_id = req.params.purId
		menu.menubar(req, menubar => {
			sql1 = 'select loginid from person;'
			sql2 = 'select mer_id, name from merchandise;'
			sql3 = 'select * from purchase where purchase_id=?'
			db.query(sql1+sql2+sql3, [pur_id], (err, subIds) => {
				context = {
					menu: menubar,
					body: 'purchaseCU.ejs',
					lgIds: subIds[0],
					items: subIds[1],
					cu: 'u',
					item: subIds[2][0]
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},
	update_process: (req, res) => {
		var post = req.body
		db.query('update purchase set loginid=?, mer_id=?, price=?, point=?, qty=?, total=? where purchase_id=?',
				[post.loginid, post.mer_id, post.price, post.price*0.5, post.qty, post.price*post.qty, post.pur_id], (err, result) => {
			res.redirect('/purchase/view/u')
		})
	},

	delete_process: (req, res) => {
		var pur_id = req.params.purId
		db.query('delete from purchase where purchase_id=?', [pur_id], (err, result) => {
			res.redirect('/purchase/view/u')
		})
	}
}