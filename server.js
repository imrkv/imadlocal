var express = require('express');
var morgan = require('morgan');
var path = require('path');
//var Pool = require('pg').Pool;
var Pool = require('mysql');
var cryptojs = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30 },
	proxy: true,
    resave: true,
    saveUninitialized: true
}));
var counter=0;
app.get('/counter', function (req , res) {
    counter = counter + 1;
    res.send(counter.toString());
});


/*
var articles = {
    'article-one': {
        title:'article-one',
        heading:'article-one',
        content:`
        <p> this is content of article one</p>
        `},
    'article-two': {
        title:'article-two',
        heading:'article-two',
        content:`
        <p> this is content of article two</p>
        `},
    'article-three': {
        title:'article-three',
        heading:'article-three',
        content:`
        <p> this is content of article three</p>
        `}
};*/

function createTemplate(data){
  var title=data.title ;
  var heading = data.heading ;
  var content=data.content ;
  var date = data.date;
  var htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>
            ${title}
        </title>
        <meta name="viewpart" content="width=device-width initial-scale=1" />
     <link href="/ui/style.css" rel="stylesheet" />
      </head>
      <body>
        <div class="container">
			<a href='/'>Home</a>
			<hr>
			<div>
				<h1>
				${heading}
				</h1>
			</div>
			<div>
				${date.toDateString()}
			</div>
			<div>
			  <p>
				${content}
			  </p>
			</div>
			<h4> Comments </h4>
			<div id="comment">
			</div>
			<div id="comment_btn">
			</div>
        </div>
        <script type="text/javascript" src="/ui/article.js"></script>
	</body>
    </html>
  `;
  return htmlTemplate;
}

function hash(input,salt){
    var hashed = cryptojs.pbkdf2Sync(input, 'salt', 10000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   var salt = cryptojs.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query("INSERT INTO user (username,password) VALUES ('" + username + "','" + dbString +"')", function(err,result,fields){
       if(err) {
          res.status(500).send(err.toString());
      }else {
          res.status(200).send("user Successfully Created" + username);
      }
   });
});

app.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query("SELECT * FROM user WHERE username = '" + username + "'", function(err,result){
       //console.log(result)
	   if(err) {
          res.status(500).send(err.toString());
      }else {
          if(result.length === 0){
              res.status(403).send('invalid username/password');
          }
          else{
              var dbString = result[0].password;
			  //console.log(dbString);
              var salt = dbString.split('$')[2];
			  //console.log(salt);
              var hashedPassword = hash(password,salt);
			 // console.log(hashedPassword);
              if(hashedPassword === dbString){

                  req.session.auth = {userId: result[0].id}
                  res.status(200).send('Credential Correct');
              }
              else{
                  res.status(403).send('invalid username/password');
              }
          }
      }
   });
});

app.get('/check-login', function(req,res){

   if(req.session && req.session.auth && req.session.auth.userId){
       res.status(200).send('You are logged in: ' + req.session.auth.userId.toString());
   } else{
       res.status(403).send("You are not logged in");
   }
});

app.get('/logout', function(req,res){
   delete req.session.auth;
   res.status(200).send('You are logged out');
});


var pool = Pool.createConnection({
	host: 'localhost',
    user:'ronak',
    database:'testdb',
    port: '3306',
    password: 'ronak12345'
});
//pool.connect();
pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.get('/test-db',function(req,res) {
   pool.query('SELECT * FROM test',function(err,result,fields){
      if(err) {
          res.status(500).send(err.toString());
      }else {
          res.send(JSON.stringify(result));
		  console.log(JSON.stringify(result));
      }
   });
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/getArticleList',function(req,res){

	pool.query("SELECT * FROM article", function(err,result){
       //console.log(result)
	  if(err) {
          res.status(500).send(err.toString());
      }else {
		if(result.length === 0){
			res.status(404).send('Article Not Found');
		}else{
			res.send(result);
		}
	  }
	});

});


app.get('/get-comments/:articleName',function(req,res){

	pool.query(`SELECT comment.user_id,comment.article_id,comment.comment,timestamp, user.username, article.title,article.id FROM article,user,comment 
				WHERE article.title = "`+ (req.params.articleName).toString() +`" AND article.id = comment.article_id AND user.id= comment.user_id 
				ORDER BY comment.timestamp DESC`, function(err,result){
       console.log(result)
	  if(err) {
          res.status(500).send(err.toString());
      }else {
		if(result.length === 0){
			res.status(404).send('No Comments');
		}else{
			res.send(result);
		}
	  }
	});

});

app.post('/submit-comment/:articleName', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        pool.query('SELECT * from article where title = "' + (req.params.articleName).toString() + '"', function (err, result) {
			console.log(result);
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result[0].id;
                    pool.query('INSERT INTO comment (comment, article_id, user_id) VALUES ("' +(req.body.comment).toString() +'","' +(articleId).toString() + '","' + (req.session.auth.userId).toString() +'")',function (err, result) {
						console.log(result);
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});


/*app.get('/:articleName', function (req , res) {
    var articleName=req.params.articleName;
   res.send(createTemplate(articles[articleName]));
});*/

app.get('/articles/:articleName', function (req , res) {
	var title = "'" + req.params.articleName + "'";
	pool.query("SELECT * FROM article WHERE title = " + title , function(err,result,fields){
    if(err) {
		  res.status(500).send(err.toString());
        }else {
            if(result.length === 0) {
                res.status(404).send('Article Not found');
            }else{
                var articleData = result[0];
				//console.log(JSON.stringify(result[0].content));
				res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/favicon.ico', function (req, res) {

  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));

});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 81;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
