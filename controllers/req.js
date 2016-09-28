var request = require('request');

var debug = require('debug')('myapp:req');
debug('進入程式');

// Configure the request
/**
24H : http://ecshweb.pchome.com.tw/search/v3.3/24h/results
24H書店 : http://ecshweb.pchome.com.tw/search/v3.3/24b/results
全部 : http://ecshweb.pchome.com.tw/search/v3.3/all/results
購物中心 : http://ecshweb.pchome.com.tw/search/v3.3/vdr/results
http://ecshweb.pchome.com.tw/search/v3.3/all/results?q=NAS&scope=all&sortParm=prc&sortOrder=ac&page=20

價錢由高至低 results?q=HTC&page=1&sort=prc/dc
價錢由低至高 results?q=HTC&page=1&sort=prc/ac
有貨優先 results?q=HTC&page=1&sort=sale/dc&type=exactforsale
新上市   results?q=HTC&page=1&sort=new/dc
價格分類	results?q=htc&page=1&sort=rnk/dc&price=24-32987

**/

var headers = {
	    'User-Agent': 'Super Agent/0.0.1',
	    'Content-Type': 'application/x-www-form-urlencoded'
};

function readPChome(url, keyWord, pages, callback){

	debug('readPChome function');

	var options = {
	    url: url,
	    method: 'GET',
	    headers: headers,
	    qs: {
	        'q': keyWord,
	        'scope':'all',
	        'sort':'',
	        'page': pages
	    }
	};

    // Start the request
    request(options, function (error, response, body) {

		debug('request function');
		debug('error:'+ error);
		debug('statusCode:'+ response.statusCode);

	    if (!error && response.statusCode == 200) {

			debug('not error');
	        var info = JSON.parse(body);
			debug('info: ' + body);
	        var jsonP1 = info.prods;
	        page = info.totalPage;

			debug('page:'+ page);
			debug('pages:'+ pages);

	    //     if (page > pages) {
	    //     	pages++;
	    //     	options.qs.page = pages;
	    //     	readPChome(url,keyWord,pages,function(err,jsonP2){
	    //     		if (err) {return callback(err)};
					// callback(null,jsonP1.concat(jsonP2));
	    //     	});
	    //     } else {
					callback(null,jsonP1);
	        // }
	    } else if(response.statusCode == 403) {
	    	console.log('Total Page: ' + page);
	    	console.log('Geted Page: ' + pages);
			callback(null,jsonP1);
	    }

    }); //request 

}; //readPChome function

/**
 * POST /  Search Products
 */
exports.result = function(req, res) {

  	req.assert('keyword', '請輸入搜尋物品!').notEmpty();
  	var errors = req.validationErrors();

	  if (errors) {
	    req.flash('error', errors);
	    return res.redirect('/');
	  }

	readPChome('http://ecshweb.pchome.com.tw/search/v3.3/all/results',req.body.keyword,1,function(err,jsonP){
		if (err) {console.log(err)};
		try {
			var info = eval(jsonP);
			info.forEach(function(value, index){
			    if (typeof(value) == "undefined") {
			        info.splice(index,1);
			    }
			});
			res.render('req/result', {
				title: 'Result',
				jsonData: info,
				jsonCount: info.length,
				key: req.body.keyword
			});
		} catch(err) {
			console.log(err);
		}
	});
};

/**
 * POST /  Search Products
 */

exports.getPrdByPid = function(pid,next,callback){

	readPChome('http://ecshweb.pchome.com.tw/search/v3.3/all/results',pid,1,function(err,jsonP){
		if (err) {console.log(err)};
		// try {
		// 	console.log(jsonP[0].name);
		// 	console.log(jsonP[0].price);
		// } catch(err) {
		// 	console.log(err);
		// }
		callback(jsonP,next);
	});

};




