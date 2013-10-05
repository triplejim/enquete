var mongoose = require('mongoose'),
	model = require('../model');

var Enquete = model.Enquete;
var Vote = model.Vote;

// アンケートのリストを表示する
exports.enquete_list = function(req, res){
	Enquete.find({}, function(err, docs){
		if(err)
			throw err;
		
		valid_enquete_list = [];
		end_enquete_list = [];
		for(var i in docs){
			if(docs[i].is_valid)
				valid_enquete_list.push(docs[i]);
			else
				end_enquete_list.push(docs[i])
		}

		res.render('index', 
			{enquete_list: valid_enquete_list, end_enquete_list: end_enquete_list});
	});
}


// アンケートの新規作成
exports.create_enquete = function(req,res){
	var title = req.body.title;

	var newEnquete = new Enquete({title: title, is_valid: true});
	newEnquete.save(function(err, result){
		if(err)
			throw err;

		res.send('create new enquete');
	});
}

// アンケートの投票受付終了
exports.end_enquete_vote = function(req, res){
	var id = req.body.enquete_no;
	Enquete.update({_id: id}, {$set: { is_valid: false}}, { upsert: false, multi: false},
		function(err){
			if(err)
				throw err;

			res.send("アンケートの投票受付を終了しました")
		})
}

// 指定されたアンケートページの表示
exports.enquete_page = function(req, res){
	var enquete_id = req.params.id;
	Enquete.findOne({_id: enquete_id}, function(err, enquete_doc){
		if(err)
			throw err;

		Vote.find({ enquete_id: enquete_id}, null,  {sort: {count: -1}}, function(err, docs){
			if(err)
				throw err;

			// 投票の不可で分ける
			if(enquete_doc.is_valid)
				res.render('enquete_page', { enquete_title: enquete_doc.title, enquete_raws: docs, enquete_id: enquete_id});
			else
				res.render('ended_enquete_page', { enquete_title: enquete_doc.title, enquete_raws: docs, enquete_id: enquete_id});
		});
	})
}

// アンケートの投票
exports.enquete_vote = function(req, res){
	var body = req.body;
	console.log(body.radio);

	Vote.findOne({_id: body.radio}, function(err, doc){
		if(err)
			throw err;

		// 投票数を1増やす
		doc.count = doc.count + 1;

		Vote.update({_id: body.radio}, {$set: {count: doc.count}},
			{upsert: false, multi: false}, function(err){
			if(err)
				throw err;

			res.send("投票を完了しました");
		});
	});

	res.send("投票を完了しました");
}

// 選択肢の追加
exports.add_choices = function(req, res){
	var body = req.body;

	Vote.find({ enquete_id: body.enquete_id, choices_name: body.choices_name}, function(err, docs){
		if(err)
			throw err;

		// すでにある選択肢の場合は追加しない
		if(docs.length==0){
			var newVote = new Vote({enquete_id: body.enquete_id, choices_name: body.choices_name, count: 0});
			newVote.save(function(err, result){
			if(err)
				throw err;

			res.send('create new choices');
			});		
		}else
			res.send('既にある選択肢です');

	});	
}