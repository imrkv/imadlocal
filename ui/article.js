var currentArticleTitle = window.location.pathname.split('/')[2];
console.log(currentArticleTitle);
function loadlogin(){
	var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              loadComments_btn();
          }else{
		  //else if (request.status === 403 || request.status === 500){
              //loadComments_btn(false);
          }
        }
    };

    //Make the request
    request.open('GET', 'http://localhost:81/check-login' ,true);
    //request.setRequestHeader('Content-Type','application/json');
    request.send(null);
}

function loadComments(){
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
			var commentsData = JSON.parse(this.responseText);
			var content='';
            for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<p>${(commentsData[i].comment)}</p>
                        <p>${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()}</p> 
                        <hr/>`;
                }
                document.getElementById('comment').innerHTML = content;
		  }
		  else{
			  document.getElementById('comment').innerHTML('Oops! Could not load comments!');
		  }
	  }
	}
	request.open('GET', 'http://localhost:81/get-comments/' + currentArticleTitle,true);
    request.send(null);
}
function loadComments_btn(){
	
	var Content = `
	<h5>Submit a comment</h5>
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comment here..."></textarea>
        <br/>
        <input type="submit" id="submit_com" value="Submit" />
        <br/>
        `;
	document.getElementById('comment_btn').innerHTML = Content;
    
    // Submit username/password to login
    var submit = document.getElementById('submit_com');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById('comment_text').value = '';
                    loadComments();    
                } else {
                    alert('Error! Could not submit comment');
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        var comment = document.getElementById('comment_text').value;
        request.open('POST', '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({"comment": comment}));
		console.log(JSON.stringify({"comment": comment}));
        submit.value = 'Submitting...';
        
    };
}

loadlogin();
loadComments();