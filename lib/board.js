var db = require('./db')
var menu = require('./menu')
var date = require('./template')	// date.now()

function loginClass(req) {
	if (req.session.is_logined) {
		return req.session.class
	} else return '99'
}

module.exports = {
	view: (req, res) => {
		var type_id = req.params.typeId
		var page = req.params.pNum
		menu.menubar(req, (menubar) => {
			sql1 = 'select * from boardtype where type_id=?;'
			sql2 = 'select count(*) as total from board where type_id=?'
			db.query(sql1+sql2, [type_id,type_id], (err, subId) => {
				var numPerPage = subId[0][0].numPerPage
				var offs = (page-1)*numPerPage
				var totalPage = Math.ceil(subId[1][0].total/numPerPage)
				switch (loginClass(req)) {
					case '01': var write_YN = 'Y'; break
					case '02': var write_YN = subId[0][0].write_YN; break
					default: var write_YN = 'N'; break
				}
				db.query('select * from board b join person p on b.loginid=p.loginid\
						where b.type_id=? and b.p_id=? order by board_id desc limit ? offset ?',	// offset은 지나간 페이지수라고 생각하자
						[type_id, 0, numPerPage, offs], (err, boards) => {
					var context = {
						menu: menubar,
						body: 'board.ejs',
						btname: subId[0][0],
						boards: boards,
						total: totalPage,
						page: page,
						write_YN: write_YN
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		})
	},

	detail: (req, res) => {
		var board_id = req.params.boardId
		var page = req.params.pNum
		if (req.session.class == '01') {
			menu.menubar(req, (menubar) => {
				var sql1 = 'select * from board b join person p on b.loginid=p.loginid where b.board_id=?;'
				var sql2 = 'select * from board b join person p on b.loginid=p.loginid where b.p_id=?'
				db.query(sql1+sql2, [board_id,board_id], (err, subId) => {
					context = {
						menu: menubar,
						body: 'boardCRU.ejs',
						board: subId[0][0],
						who: subId[0][0].name,
						page: page,
						loginid: req.session.loginid,
						login_name: req.session.name,
						cru: 'R',
						accessible: 'Y',
						replies: subId[1]
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		}
		else if (req.session.class == '02') {
			menu.menubar(req, (menubar) => {
				var sql1 = 'select * from board b join person p on b.loginid=p.loginid where b.board_id=?;'
				var sql2 = 'select * from board b join person p on b.loginid=p.loginid where b.p_id=?'
				db.query(sql1+sql2, [board_id,board_id], (err, subId) => {
					context = {
						menu: menubar,
						body: 'boardCRU.ejs',
						board: subId[0][0],
						who: subId[0][0].name,
						page: page,
						loginid: req.session.loginid,
						login_name: req.session.name,
						cru: 'R',
						replies: subId[1]
					}
					if (req.session.loginid == subId[0][0].loginid) context['accessible'] = 'Y'
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		}
		else {
			menu.menubar(req, (menubar) => {
				var sql1 = 'select * from board b join person p on b.loginid=p.loginid where b.board_id=?;'
				var sql2 = 'select * from board b join person p on b.loginid=p.loginid where b.p_id=?'
				db.query(sql1+sql2, [board_id,board_id], (err, subId) => {
					context = {
						menu: menubar,
						body: 'boardCRU.ejs',
						board: subId[0][0],
						who: subId[0][0].name,
						page: page,
						cru: 'R',
						replies: subId[1]
					}
					req.app.render('home', context, (err, html) => res.send(html))
				})
			})
		}
	},

	create: (req, res) => {
		var type_id = req.params.typeId
		switch(loginClass(req)) {
			case '01':
			case '02':
				menu.menubar(req, (menubar) => {
					db.query('select * from boardtype where type_id=?', [type_id], (err, bt) => {
						context = {
							menu: menubar,
							body: 'boardCRU.ejs',
							btname: bt[0],
							loginid: req.session.loginid,
							cru: 'C',
							who: req.session.name
						}
						req.app.render('home', context, (err, html) => res.send(html))
					})
				})
				break
			default:
				res.send(`<script>alert('로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	create_process: (req, res) => {
		var post = req.body
		db.query('insert into board (type_id, p_id, loginid, password, title, date, content) values(?,?,?,?,?,?,?)',
				[post.type_id, 0, post.loginid, post.password, post.title, date.now(), post.content], (err, result) => {
			res.redirect(`/board/detail/${result.insertId}/1`)
		})
	},

	update: (req, res) => {
		var board_id = req.params.boardId
		var type_id = req.params.typeId
		var page = req.params.pNum
		switch(loginClass(req)) {
			case '01':
			case '02':
				menu.menubar(req, (menubar) => {
					sql1 = 'select * from boardtype where type_id=?;'
					sql2 = 'select * from board b join person p on b.loginid=p.loginid where b.board_id=?'
					db.query(sql1+sql2, [type_id, board_id], (err, subId) => {
						context = {
							menu: menubar,
							body: 'boardCRU.ejs',
							btname: subId[0][0],
							board: subId[1][0],
							cru: 'U',
							who: subId[1][0].name,
							page: page
						}
						req.app.render('home', context, (err, html) => res.send(html))
					})
				})
				break
			default:
				res.send(`<script>alert('로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},
	update_process: (req, res) => {
		var post = req.body
		db.query('update board set title=?, content=? where board_id=?',
				[post.title, post.content, post.board_id], (err, result) => {
			res.redirect(`/board/detail/${post.board_id}/${post.page}`)
		})
	},

	delete_process: (req, res) => {
		switch(loginClass(req)) {
			case '01':
			case '02':
				var board_id = req.params.boardId
				var type_id = req.params.typeId
				var page = req.params.pNum
				db.query('delete from board where board_id=?', [board_id], (err, result) => {
					res.redirect(`/board/view/${type_id}/${page}`)
				})
				break
			default:
				res.send(`<script>alert('로그인이 필요한 작업입니다.');location.href='/'</script>`)
		}
	},

	reply_create_process: (req, res) => {
		var post = req.body
		db.query('insert into board (type_id, p_id, loginid, password, date, content) values(?,?,?,?,?,?)',
				[post.type_id, post.p_id, post.loginid, '', date.now(), post.content], (err, result) => {
			res.redirect(`/board/detail/${post.p_id}/${post.page}`)
		})
	},
	reply_delete_process: (req, res) => {
		var post = req.body
		db.query('delete from board where board_id=?', [post.re], (err, result) => {
			res.redirect(`/board/detail/${post.board_id}/${post.page}`)
		})
	}
}