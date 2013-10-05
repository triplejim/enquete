var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// アンケートのタイトル保存・投票受付を行っているか
var EnqueteSchema = new Schema({
	title: { type: String, require: true}, 		// アンケートタイトル
	is_valid: { type: Boolean, require: true}	// 投票が可能か
});

// アンケート結果の保存(選択肢+投票数)
var VoteSchema = {
	enquete_id: { type: String, require: true},	 // アンケートID
	choices_name: { type: String, require: true},	// 選択肢名
	count: { type: Number, require: true}			// 投票数
}

// mongoDB接続時のエラーハンドリング
// mongodb://[hostname]/[dbname]
mongoose.connect('mongodb://localhost/enquete');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connecetion error'));
db.once('open', function() {
  console.log("Connected to 'Enquete db' database");
});

exports.Enquete = mongoose.model('Enquete', EnqueteSchema);
exports.Vote = mongoose.model('Vote', VoteSchema);