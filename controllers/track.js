require('../models/Track');
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Track = mongoose.model('Track');
var moment = require("moment");
moment.locale('zh-tw');


/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

/**
 * POST /   ADD Track
 */

exports.track = function(req, res) {

	var debug = require('debug')('myapp:track');
	debug('進入track');
	console.log('track: ' + req.body.pid);

	new Track({
		name: req.body.name,
		pid: req.body.pid,
		uid: req.body.uid,
		umail: req.body.umail,
		price: req.body.price,
		pic: req.body.pic,
		track: true,
		CreateDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
		UpdateDate: moment().calendar()
	}).save( function( err ){
		if (err) {
			console.log('Fail to save to DB.');
			console.log(err);
			return;
		}
		console.log('Save to DB.');
	});		
	res.send("ajaxReturn: " + req.body.uid + " save to db!");
};


/**
 * GET /  GET Tracked List
 */
exports.trackedList = function(req, res) {

	var debug = require('debug')('myapp:track');
	Track.find({uid:req.user.id}).sort({price:1}).exec(function (err, Tracks, count){
		if (err) {console.log(err);}
		res.render( 'trackList/tracked', {
			title: '追蹤清單',
			Track: Tracks
		});
	});
	


};

/**
 * POST /  DELETE Tracked Item
 */
exports.deleteItem = function(req, res) {

	var debug = require('debug')('myapp:DELETE');

	Track.remove({ pid: req.body.pid, uid: req.body.uid }, function(err) {
	    if (err) {
			res.send('err: ' + err);
			console.log(req.body.pid);
			console.log(req.body.uid);
	    }
	    else {
			res.send('success');
	    }
	});

};


