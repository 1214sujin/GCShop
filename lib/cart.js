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
	
	create: (req, res) => {},

	update: (req, res) => {},
	update_process: (req, res) => {}
}
