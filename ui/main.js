/*
var button = document.getElementById('counter');
button.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200 ){
            var counter=request.responseText;
            var span=document.getElementById('count');
            span.innerHTML=counter.toString();
        }  
    };

    //Make the request
    request.open('GET', 'http://rkvithlani.imad.hasura-app.io/counter',true);
    request.send(null);
};

var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200 ){
            var names=request.responseText;
            names=JSON.parse(names);
            var list='';
            for(var i=0;i<names.length;i++){
                list += "<li>" + names[i] + "</li>";
                }
            var ul=document.getElementById('namelist');
            ul.innerHTML=list;
        }  
    };

    //Make the request
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET', 'http://rkvithlani.imad.hasura-app.io/submit-name?name=' + name ,true);
    request.send(null);
};*/

var login_submit = document.getElementById('login_btn');
login_submit.onclick = function() {
	
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              alert('logged in successfully');
			  checklogin();
		  }else if (request.status === 403  ){
              alert('incorrect username/password');
          }else if (request.status === 500 ){
              alert('something went wrong with server');
          }
        }
    };

    //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    request.open('POST', 'http://localhost:81/login' ,true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
};

var register_submit = document.getElementById('register_btn');
register_submit.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              alert('Register successfully');
		  }else if (request.status === 403  ){
              alert('username exist');
          }else if (request.status === 500 ){
              alert('something went wrong with server');
          }
        }
    };

    //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
	if(!(username) || !(password)){
		alert('username or password cannot be empty');
		return;
	}
    request.open('POST', 'http://localhost:81/create-user' ,true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
};

var logout_submit = document.getElementById('logout_btn');
logout_submit.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              checklogin();
			  alert('logged out successfully');
			  
          }else{
		  //else if (request.status === 403 || request.status === 500  ){
              alert('Something went Wrong');
          }
        }
    };

    //Make the request
    request.open('GET', 'http://localhost:81/logout' ,true);
    //request.setRequestHeader('Content-Type','application/json');
    request.send(null);
};

function checklogin(){
	var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              document.getElementById('loginpane').style.display='none';
			  document.getElementById('logoutpane').style.display='block';
			  
          }else{
		  //else if (request.status === 403 || request.status === 500){
              document.getElementById('loginpane').style.display='block';
			  document.getElementById('logoutpane').style.display='none';
			  
          }
        }
    };

    //Make the request
    request.open('GET', 'http://localhost:81/check-login' ,true);
    //request.setRequestHeader('Content-Type','application/json');
    request.send(null);
}

function createList(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
			  var result=JSON.parse(request.responseText);
			  //console.log(result);
			  var content = "<ul>";
				for(var i=0;i<result.length;i++){
					content += `<li><a href="/articles/${result[i].title}">${result[i].heading}</a> (${result[i].date.split('T')[0]})</li>`;
				}
				content += "</ul>";
					//var heading = result[i].heading;
					//console.log(heading);
					//var text = document.createTextNode(heading);
					//var li = document.createElement('li');
					//li.appendChild(text);
					document.getElementById('articlelist').innerHTML=content;
			
          }
		  else{
			  document.getElementById('articlelist').innerHTML='Cannot load Articles';
		  }
        }
    };
	
	request.open('GET', 'http://localhost:81/getArticleList' ,true);
    //request.setRequestHeader('Content-Type','text/html');
    request.send(null);
}

createList();
checklogin();
