var db = require('./db')
var menu = require('./menu')
var date = require('./template')

module.exports = {
	home: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select image, name, p.price, qty, total, date from purchase p join merchandise m on p.mer_id=m.mer_id where p.loginid=? order by purchase_id desc',
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
		db.query('insert into purchase (loginid, mer_id, date, price, point, qty, total) values(?,?,?,?,?,?,?)',
				[req.session.loginid, post.mer_id, date.now(), post.price, post.price*0.5, post.qty, post.price*post.qty], (err, result) => {
			res.redirect('/purchase')
		})
	},
	cancel_process:(req, res) => {
		var purchase_id = req.params.purId
		db.query(`update purchase set cancel='Y' where purchase_id=?`, [purchase_id], (err, result) => {
			res.redirect('/purchase')
		})
	},
	
	cart: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select * from cart 조인 필요 where loginid=?', [req.session.loginid], (err, list) => {
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
	}
}
