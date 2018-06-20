var allredon = {'led3':true,'led5':true,'led7':true, 'led9':true, 'led11':true, 'led13':true}; 
var allredoff = {'led3':false,'led5':false,'led7':false, 'led9':false, 'led11':false, 'led13':false};
var allyellowon = {'led12':true}; 
var allyellowoff = {'led12':false}; 

window.targetThing = "";
window.alertActive = false;
window.emailActive = false;
window.userEmailAddress = "";
window.servicerq1 = false;
window.servicerq2 = false;
window.key = "";

$.support.cors = true;

setTimeout(function(){
	$('button#thingsubmit').click(function(e){
		window.setThing($("#thingfield").val());
		freeboard.setDatasourceSettings("DemoBoard", {"thing_id":window.targetThing});
	    	$("#thingfield").prop('disabled', true);
	    	$('button#thingsubmit').prop("disabled",true);
	
	});	
	$('button#emailsubmit').click(function(e){
		var emailaddy = $("#emailfield").val();
	    	console.log(emailaddy);
	    	window.setEmailAddress(emailaddy);
	    	$("#emailfield").prop('disabled', true);
	    	$('button#emailsubmit').prop("disabled",true);
	});	
	
},3000);


window.tipAlert = function(){
	dweetio.dweet_for(window.targetThing+'-send', this.allredon, function(err, dweet){
	});
	freeboard.showDialog($("<div align='center'>Alert!  Machine was tipped over.  Send Repair Team.</div>"),"Alert","ok",null,function(){window.alertActive=false;dweetio.dweet_for(window.targetThing+'-send', this.allredoff, function(err, dweet){});}); 
	window.alertActive = true;
}

window.setThing = function(thingname) {
	window.targetThing = thingname;
}

window.setEmailAddress = function(email) {
	window.userEmailAddress = email;
}

window.sendEmailAlert = function() {
	window.emailActive = true;
	if (window.userEmailAddress !== '') {
		$.ajax({
		  type: "POST",
		  url: "https://mandrillapp.com/api/1.0/messages/send.json",
		  data: {
		    'key': window.key,
		    'message': {
		      'from_email': 'no-reply@freeboard.io',
		      'to': [
		          {
		            'email': window.userEmailAddress,
		            'type': 'to'
		          }
		        ],
		      'autotext': 'true',
		      'subject': 'RL78 Refrigeration Alert!',
		      'html': 'Temperature exceeded threshold.'
		    }
		  }
		 }).done(function(response) {
		 });
	}
}

window.resetEmail = function() {
	window.emailActive = false;
}

window.startServiceRequest = function() {
	window.servicerq1 = true;
	freeboard.showDialog($("<div align='center'>Service Request Detected!  Please press Confirm</div>"),"Alert","Confirm",null,function(){dweetio.dweet_for(window.targetThing+'-send', {"led15":true}, function(err, dweet){});}); 
}

window.endServiceRequest = function() {
	window.servicerq2 = true;
	dweetio.dweet_for(window.targetThing+'-send', {"led15":false}, function(err, dweet){});
}
