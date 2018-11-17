const express               = require('express'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      bodyParser            = require('body-parser'),
      User                  = require('./models/user')
      LocalStrategy         = require('passport-local'),
      PassportLocalMongoose = require('passport-local-mongoose');


const app = express()
mongoose.connect('mongodb://localhost/auth', { useNewUrlParser: true })
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.use(require('express-session')({
  secret: 'The janitor left the keys next to the oak tree',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Routes

app.get('/', function(req, res) {
  res.render('home')
})

app.get('/secret', isLoggedIn, function(req, res) {
  res.render('secret')
})

// Auth Routes

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', function(req, res) {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err){
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/secret')
    })
  })
})

// Login Routes
app.get('/login', function(req, res) {
  res.render('login')
})

// middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
  }), function(req, res) {
})

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log('console has started!')
})
