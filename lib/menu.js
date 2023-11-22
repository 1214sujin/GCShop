var db = require('./db')

module.exports = {
	menubar: (req, cb) => {
		sql1 = `select title, type_id from boardtype;`
		sql2 = `select * from code_tbl where main_id='0000'`
		db.query(sql1+sql2, (err, subIds) => {
			if (err) console.log(err)
			var context = {
				who: req.session.name,
				boardtypes: subIds[0],
				categories: subIds[1]
			}
			switch (req.session.class) {
				case '00': var menu='menuForMIS'; context['categories']=undefined; break
				case '01': var menu='menuForManager'; break
				case '02': var menu='menuForCustomer'; break
				default: var menu='menuForCustomer'; context['who']='손님'; context['logined']='NO'
			}
			req.app.render(menu, context, (err, html) => cb(html))
		})
	}
}