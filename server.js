// getting all the required packages
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
// end



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



// adding middleware body-parser, it will parse the form when submitted
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// end of body-parser middle ware

// set static path
app.use(express.static(path.join(__dirname, 'public')));


// set view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// end of view engine


// creating server at 3000 port
app.listen(3000, function(req, res) {
	console.log("server started at port 3000.....");
});
// end


// making data to pass at ejs page
var users = [
{
	id:1,
	firstName: "rakesh",
	lastName: "sharma",
	email:"rakesh.sharma8320@gmail.com"
},
{
	id:2,
	firstName: "nitin",
	lastName: "sharma",
	email:"nitin.sharma8320@gmail.com"
},
{
	id:3,
	firstName: "sachin",
	lastName: "sharma",
	email:"sachin.sharma8320@gmail.com"
}
]



var obj = {
		title: "express tutorial",
		users: users
	}

// adding default route
app.get("/", function(req, res){
	
	res.render("index",obj);
});

app.post("/users/add", function(req, res){
	req.checkBody('firstName', 'first name is required').notEmpty();
	req.checkBody('lastName', 'last name is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		obj.errors = errors
		res.render("index",obj);
		console.log(obj);
	}
	else{
		firstName = req.body.firstName;
		lastName = req.body.lastName;
		email = req.body.email;
	console.log("form submitted");
	res.send(req.body.firstName );
	} 	
})