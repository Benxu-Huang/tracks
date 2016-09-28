$(function() {
  // Your custom JavaScript goes here
  moment().format();

});


function track(obj) {
	console.log('ajax')
	var pid = $(obj).attr("data-pid");
    var umail = $(obj).attr("data-umail");
	var price = $(obj).attr("data-price");
	var pic = $(obj).attr("data-pic");
	var name = $(obj).attr("data-name");
	var uid = $(obj).attr("data-uid");

	if (uid == 'nologin') {
		alert('請登入會員！');
		return;
	} else {
		$.ajax({
		    method: "POST",
		    url: "/track",
		    data: { pid: pid, uid: uid, price: price, pic: pic, name: name, umail: umail },
		    success: function(data){
		        // alert(data);
		        $(obj).attr('disabled', true);
		        $(obj).html('Tracked');
		        $(obj).closest("tr").remove();
		    }
		})
	}
};


function deleteItem(obj) {
	var pid = $(obj).attr("data-pid");
	var uid = '01';
	$.ajax({
	    method: "POST",
	    url: "/deleteItem",
	    data: { pid: pid, uid: uid},
	    success: function(data){
	        if (data == 'success') {
	        	$(obj).attr('disabled', true);
	        	$(obj).html('deleted');
	        	$(obj).closest("tr").remove();
	        }
	    }
	})
};