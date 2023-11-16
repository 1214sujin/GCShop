var db = require('./db')
var date = require('./template')

module.exports = {
	home: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select * from purchase loginid=?', [req.session.loginid], (err, list) => {
				context = {
					menu: menubar,
					body: 'purchase'
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},
	create_process: (req, res) => {
		res.send('create_process')
		// var mer_id = req.params.merId
		// var post = req.body
		// menu.menubar(req, (menubar) => {
		// 	db.query('insert into purchase (loginid, mer_id, date, price, point, qty, total) values(?,?,?,?,?,?,?)',
		// 			[req.session.loginid, mer_id, date.now(), post.price, post.price*0.5, ], (err, result) => {
		// 		res.redirect('/purchase')
		// 	})
		// })
	},
	delete_process:(req, res) => {
		res.send('create_process')
		// menu.menubar(req, (menubar) => {
		// 	db.query(`update purchase set cancel='Y' where purchase_id=?`,
		// 				[purchase_id], (err, result) => {
		// 			res.redirect('/purchase')
		// 		})
		// })
	},
	
	cart: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select * from cart where loginid=?', [req.session.loginid], (err, list) => {
				context
			})
		})
	},
	cart_process: (req, res) => {
		res.send('cart_process')
		// var post = req.body
	}
}
