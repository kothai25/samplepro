var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser')
var app = express();
var path = require("path");
var http = require('http').Server(app);
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var moment = require('moment');
var dateTime = require('node-datetime');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "",
        pass: ""
    }
});
app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true
}));

// Getting Current timestamp and converting into date and time
var timestamp = moment().unix().toString();
var current_date = moment().locale('en').format('YYYY-MM-DD');
var current_time = moment().locale('en').format('hh:mm:ss A');
var created_date=current_date+current_time;
console.log(created_date);
//to convert timestamp into date and time
function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
            s = ('0' + d.getSeconds()).slice(-2),
            ampm = 'AM',
            time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM	
    date = yyyy + '-' + mm + '-' + dd;
    time = h + ':' + min + ':' + s + ' ' + ampm;
    var arr = [date, time];
    return arr;
}


//Random number generation
var rand, mailOptions, host, link;
rand = Math.floor((Math.random() * 100) + 54);
var rand, host, link;

var MongoClient = require('mongodb').MongoClient, format = require('util').format;

//connecting mongodb
MongoClient.connect('mongodb://127.0.0.1:27017/eliteworld', function (err, db) {
    if (err)
        throw err;
    console.log("Connected to Database");

    var token_key_result;

    token_key_result = require('crypto').randomBytes(32).toString('hex');

    app.use(express.static(__dirname + '/'));
// parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({extended: false}))

// parse application/json 
    app.use(bodyParser.json())

// Registrating details into db and Sending verification email
    app.post('/register', function (req, res) {
        var document = {title: req.body.title, firstname: req.body.firstname, lastname: req.body.lastname, dob: req.body.dob, email: req.body.email, password: req.body.password, registration_token: "", status: "pending", created_date:created_date,resetpassword_key: "", timestamp:""};
        db.collection('register').insert(document, function (err, result) {
            console.log("Id: " + document._id);
            if (err) {
                return res.send(err);
            } else {
                db.collection('register').update({"_id": document._id}, {$set: {"registration_token": document._id + rand}});
                host = req.get('host');
                link = "http://" + req.get('host') + "/verify?id=" + document._id + rand;
                console.log(link);
                transporter.sendMail({
                    from: 'atom.kothai@gmail.com',
                    to: req.body.email,
                    subject: "Please confirm your Email account",
                    html: "Hello," + req.body.firstname + req.body.lastname + "<br> Thank you for registering with EliteWorks<br>To activate your account please click on the link below or copy and paste it into your browser:<br><a href=" + link + ">Click here to verify</a><br>Once you have activated your account will be activated<br>Kind regards,<br>EliteWorld"
                });
                console.log('Submitted Successfully');
                // res.send('Submitted Successfully and Please check your email for account activation');
                return res.send(link);
            }
        });
    });

//Registration Verification
    app.get('/verify', function (req, res) {

        if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host')))
        {
            console.log("Domain is matched. Information is from Authentic email");
            db.collection('register').findOne({"registration_token": req.query.id}, function (err, result) {
                if (err) {
                    return res.send(err);
                } else if (result == null) {
                    console.log("Registration Id is invalid");
                    res.send('Invalid Id');
                } else
                {
                    db.collection('register').update({"registration_token": req.query.id}, {$set: {"status": "active"}});
                    console.log("Account is Activated");
                    res.redirect('/login');
                }
            });
        } else
        {
            res.end("<h1>Request is from unknown source");
        }
    });

//Login Verification

    app.post('/loginverification', function (req, res) {
        db.collection('register').find({"email": req.body.email, "password": req.body.password}).count({}, function (err, result) {
            if (err)
                throw err;
            else if (result > 0) {
                db.collection('register').find({"email": req.body.email, "status": "active"}).count({}, function (err, result) {
                    if (err)
                        throw err;
                    else if (result > 0) {
                        db.collection('register').findOne({"email": req.body.email}, function (err, result) {
                            if (err)
                                throw err;
                            else if (result != null) {
                                sess = req.session;
                                sess.sessdata = {};
                                sess.sessdata.firstname = result.firstname;
                                sess.sessdata.lastname = result.lastname;
                                sess.sessdata.email = result.email;
                                res.send("Successfully logged in");
                            }
                        });
                    } else
                    {
                        console.log("Your Account is not activated");
                        return res.send("Your Account is not activated");
                    }
                });
            } else {
                console.log("Invalid email and password");
                return res.send("Invalid email and password");
            }
        });
    });

    //Account
    app.get('/account', function (req, res) {
        // console.log(sess.sessdata);
        res.send("Invalid email and password");
    });


//Forgot Password
    app.post('/forgotpassword', function (req, res) {
        host = req.get('host');
        link = "http://" + req.get('host') + "/resetpasswordkey?token=" + token_key_result;
        db.collection('register').findOne({"email": req.body.email}, function (err, result) {
            if (err)
                throw err;
            else if (result != null) {
                db.collection('register').update({"email": req.body.email}, {$set: {"resetpassword_key": token_key_result,"timestamp": timestamp}});
                transporter.sendMail({
                    from: 'atom.kothai@gmail.com',
                    to: req.body.email,
                    subject: "Elite World - Password Reset",
                    html: "Hello," + req.body.firstname + req.body.lastname + "<br>You have requested to change your password for your Elite World user account. To complete the reset process please click here:<br><a href=" + link + ">Click here to verify</a><br>If you do not receive your verification email it might be worth checking your spam folder.<br>Kind regards,<br>EliteWorld"
                });
                console.log('Password Reset Token sent to mail..Please check!');
                //return res.send('Password Reset Token sent to mail..Please check!');
                res.send(link);
            } else
            {
                console.log('Email does not exist');
                res.send('Email does not exist');
            }
        });
    });

//Reset Password Verification
    app.get('/resetpasswordkey', function (req, res) {

        if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host')))
        {
            console.log("Domain is matched. Information is from Authentic email");
            db.collection('register').findOne({"resetpassword_key": req.query.token}, function (err, result) {
                if (err) {
                    return res.send(err);
                } else if (result == null) {
                    console.log("Reset Password Token is invalid");
                    res.send('Invalid token');
                } else
                {
                    var verify_timestamp = result.timestamp;
                    var db_time = convertTimestamp(verify_timestamp);
                    var final_db_date = db_time[0];
                    var final_db_time = db_time[1];

                    var dateB = moment(current_date);
                    var dateC = moment(final_db_date);
                    console.log(dateB);
                    console.log(dateC);
                    var date_diff = dateB.diff(dateC, 'days');

                    var startTime = moment(current_time, 'hh:mm:ss a');
                    var endTime = moment(final_db_time, 'hh:mm:ss a');

                    var hours = endTime.diff(startTime, 'hours');
                    console.log(date_diff);
                    console.log(hours);
                    var mins = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("mm");
                    var second = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("ss");

                    if (date_diff > 1 || hours > 12)
                    {
                        console.log("Reset Password Token has been expired");
                        res.send("Reset Password Token has been expired");
                    } else
                    {
                        var url = req.protocol + '://' + req.get('host') + '/#/'+'resetpassword';
                        res.redirect(url);
                        
                    }

                }
            });
        } else
        {
            res.end("<h1>Request is from unknown source");
        }
    });
//Reset Password
    app.post('/resetpassword', function (req, res) {
        db.collection('register').findOne({"resetpassword_key": req.body.password_reset_key}, function (err, result) {
            if (err)
                throw err;
            else if (result != null) {
                db.collection('register').update({"resetpassword_key": req.body.password_reset_key}, {$set: {"password": req.body.password}}, function (err, result) {
                    if (err)
                        return res.send(err);
                    else
                    {
                        
                        res.send("Successfully Password has been resetted");
                    }
                });
            } else
            {
                res.send("Password Reset Key does not match");
            }

        });
    });

});
app.listen(4000);
console.log('server listening in port 4000');