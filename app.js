const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database/database')
const session = require('express-session')
var app = express();
const {
  isUserLogedIn
} = require('./isUserLogedIn')

app.use(express.static('static'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: 'code_fury',
  secret: "Secret",
  resave: false,
  saveUninitialized: false,
}))

app.set('view engine', 'ejs');

app.get('/trial', (req, res) => {
  console.log("trial.....");
  res.render('trial');
});

app.get('/login', (req, res) => {
  res.render('login', {
    err: null
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    err: null
  });
});

app.get('/homepage', (req, res) => {
  res.render('homepage');
});

app.post('/login', (req, res) => {
  let {
    email,
    password
  } = req.body
  database.loginUser(email, password)
    .then((sl_no) => {
      req.session.isUserLogedIn = true;
      req.session.sl_no = sl_no
      //Render Home page
      console.log("home...")
      res.redirect('/')
    })
    .catch(err => {
      res.render('login', {
        err: err
      })
    }) // Render Login Page

})
app.post('/register', (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    qualification,
    jobExperience,
    jobSector
  } = req.body
  database.signUpUser(firstName, lastName, email, password, mobileNumber, qualification, jobExperience, jobSector)
    .then((sl_no) => {
      res.render('login', {
        err: null
      })
    })
    .catch(err => {
      res.render('login', {
        err: err
      })
    }) // Render Login Page
  // res.render('login', {
  //   err: null
  // })
})

app.get('/postJob', (req, res) => {
  res.render('postJobs');
});

app.post('/postJob', isUserLogedIn, (req, res) => {
  let body = {
    jobTitle,
    jobDescription,
    jobSector,
    noOfVacancies,
    ownerEmail
  } = req.body

  console.log('body', body)

  database.postJob(jobTitle, jobDescription, jobSector, noOfVacancies, ownerEmail)
    .then((sl_no) => {
      res.redirect('/')
    })

    .catch(err => {
      console.log(err)
      //res.('/') // Render Login Page
      // res.render('login', {
      //   err: null
      // })
    })
});

app.get('/', isUserLogedIn, (req, res) => {
  console.log("inside /");
  database.getAllJobs()
    .then(rows => {

      console.log("home page");
      console.log("Jobs", rows);
      res.render('home', {
        rows: rows
      })
    })
    .catch(err => {
      console.log(err)
    })
});

app.listen(3000, function() {
  console.log("running in 3000");
  database.connect();
});