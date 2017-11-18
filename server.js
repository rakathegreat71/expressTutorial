// getting all the required packages
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
// end

// creating db
var db = mongojs('expressTutorial',['users']);


// initializing app
var app = express();

// this part will show logging on console whenever page will be reloded
var logger = function (req, res, next) {
	console.log("logging....");
	next();
}
app.use(logger);
// end of logging

// express validator middleware
app.use(expressValidator({
	errorFormater: function (param, msg, value) {
		var nameSpace = param.split('.');
		var root = nameSpace.shift();
		var formParam = root;

		while(nameSpace.length){
			formParam += '[' +nameSpace.shift() +']';
		}

		return{
			param: formParam,
			msg: msg,
			value: value
		}
	}
}))

// adding global variable
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
})



// adding middleware body-parser, it will parse the form when submitted
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// end of body-parser middle ware

// set static path
app.use(express.static(path.join(__dirname, '/public')));


// set view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// end of view engine


// creating server at 3000 port
app.listen(4000, function(req, res) {
	console.log("server started at port 4000.....");
});
// end



// adding default route
app.get("/", function(req, res){
	db.users.find(function (err, data) {
		console.log(data);
		obj = {
			title: "exress tutorial",
			users: data
		}
		res.render("index",obj );
	})
});

app.post("/users/add", function(req, res){
	req.checkBody('firstName', 'first name is required').notEmpty();
	req.checkBody('lastName', 'last name is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();
	

	db.users.find(function (err, data) {
		var errors = req.validationErrors();
		if(errors){
			res.render("index",{
				title: "express tutorials",
				users: data,
				errors: errors
			});
		}
		else{
			var newUser = {
				firstName :req.body.firstName,
				lastName :req.body.lastName,
				email :req.body.email	
			}
			db.users.insert(newUser, function (err, result) {
				if (err) {
					console.log("error in inserting");
				}
			})
			console.log("form submitted");
			res.redirect("/");
		}	
	})

})

app.delete('/user/delete/:id', function (req, res) {
	db.users.remove({_id: mongojs.ObjectId(req.params.id)},function (err, result) {
		if (err) {
			console.log(err);
		}
	res.redirect('/');
		
			
		
	});
})



// ADDING database functions

