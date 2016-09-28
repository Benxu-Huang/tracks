require('../models/Track');
var req = require('./req.js');
var async = require('async');
var request = require('request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Track = mongoose.model('Track');
var nodemailer = require('nodemailer');
var moment = require("moment");
moment.locale('zh-tw');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB);

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

var mailOptions = {
  from: 'trackme.tw@gmail.com',
  to: '',
  subject: '',
  html: ''
};



var update = function (callback) {  
  async.waterfall([
      function(next){
      	Track.find({track:true}).sort({price:1}).exec(function (err, Tracks, count){
    			if (err) {console.log(err)};
          if (Tracks.length==0) {process.exit(0);}
    			next(null,Tracks);          
  		  });
    },
      function(Tracks, next) {
        async.eachSeries(Object.keys(Tracks), function (item, next) {
          req.getPrdByPid(Tracks[item].pid, next, function(jsonP, next){

            next();

            if (Tracks[item].price != jsonP[0].price) {
              
              Track.update({pid: jsonP[0].Id}, {$set : {price: jsonP[0].price, UpdateDate: moment().calendar() }}, function(err, next){
                  if (err) {console.log(err)};
                  console.log('updated: '+ jsonP[0].name);
                  console.log('mail: '+ Tracks[item].umail);
                  
                  mailOptions.to = Tracks[item].umail;
                  mailOptions.subject = '[TrackMe] 提醒您以下的商品價格已更新：'+ jsonP[0].name + moment().format('lll') ;
                  mailOptions.html = "<h2>產品: </h2><p>"+"<a href='http://24h.pchome.com.tw/prod/"+jsonP[0].Id+"' target='blank'>"+jsonP[0].name+"</a></p> <h2>價格已經更新為： "+jsonP[0].price+"</h2> <h2>提醒服務提供來自: <a href='http://mega-app-1.herokuapp.com/' target='blank' style='display:inline-block;'><p>TrackMe.tw</p></a></h2>";
                  transporter.sendMail(mailOptions, function(err) {
                    console.log('sendMail: '+ jsonP[0].name + ' success!');
                    console.log(mailOptions.subject);
                    if (parseInt(item)+parseInt("1") == Tracks.length) {
                        process.exit(0);
                    } 
                  });

              });

            } else {

              Track.update({pid: jsonP[0].Id}, {$set : { UpdateDate: moment().calendar() }}, function(err, next){
                  if (err) {console.log(err)};
                  console.log('not need update: '+ jsonP[0].name);
                  if (parseInt(item)+parseInt("1") == Tracks.length) {
                      process.exit(0);
                  }
              });
                 
            } 
          }); 
        });
      }], 
      	function(err, result) {
    		  if (err) console.error(err.stack);
    		  console.log('完成: ' + result);
    		  process.exit(0);
      }); 
    };

update();

