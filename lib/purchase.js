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
		if (post.cart_id) {
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
	
	cart: (req, res) => {
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
	cart_process: (req, res) => {
		var post = req.body
		db.query('insert into cart (loginid, mer_id, date) values(?,?,?)',
				[req.session.loginid, post.mer_id, date.now()], (err, result) => {
			res.redirect('/purchase/cart')
		})
	}
}
