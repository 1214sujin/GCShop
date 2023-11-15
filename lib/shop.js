var db = require('./db')
var menu = require('./menu')

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
				console.log(context['item'], context['item']=='')
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	},

	detail: (req, res) => {
		menu.menubar(req, (menubar) => {

		})
	}
}