var db = require('./db')
var menu = require('./menu')
var date = require('./template')

module.exports = {
	home: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select * from cart c join merchandise m on c.mer_id=m.mer_id where c.loginid=? order by cart_id desc', [req.session.loginid], (err, list) => {
				context = {
					menu: menubar,
					body: 'cart.ejs',
					list: list
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},
	create_process: (req, res) => {
		var post = req.body
		db.query('insert into cart (loginid, mer_id, date) values(?,?,?)',
				[req.session.loginid, post.mer_id, date.now()], (err, result) => {
			res.redirect('/purchase/cart')
		})
	},

	vu: (req, res) => {
		var vu = req.params.vu
		menu.menubar(req, (menubar) => {
			db.query('select * from cart c join merchandise m on c.mer_id=m.mer_id order by cart_id desc', (err, list) => {
				context = {
					menu: menubar,
					body: 'cart.ejs',
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
					body: 'cartCU.ejs',
					items: items,
					cu: 'c'
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	update: (req, res) => {
		var cart_id = req.params.cartId
		menu.menubar(req, menubar => {
			sql1 = 'select loginid from person;'
			sql2 = 'select mer_id, name from merchandise;'
			sql3 = 'select * from cart where cart_id=?'
			db.query(sql1+sql2+sql3, [cart_id], (err, subIds) => {
				context = {
					menu: menubar,
					body: 'cartCU.ejs',
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
		db.query('update cart set loginid=?, mer_id=? where cart_id=?',
				[post.loginid, post.mer_id, post.cart_id], (err, result) => {
			console.log(err)
			res.redirect('/purchase/cart/view/u')
		})
	},

	delete_process: (req, res) => {
		var cart_id = req.params.cartId
		db.query('delete from cart where cart_id=?', [cart_id], (err, result) => {
			res.redirect('/purchase/cart/view/u')
		})
	}
}
