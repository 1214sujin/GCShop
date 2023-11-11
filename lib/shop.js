var db = require('./db')
var menu = require('./menu')

module.exports = {
	home: (req, res) => {
		menu.menubar(req, (menubar) => {
			db.query('select * from merchandise', (err, items) => {
				var context = {
					menu: menubar,
					body: 'merchandise.ejs',
					item: items,
					isU: false
				}
				req.app.render('home', context, (err, html) => res.send(html))
			})
		})
	}
}