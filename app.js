const express = require('express'),
      app     = express()

mongoose.connect('mongodb://localhost/auth')
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('home')
})

app.get('/secret', function(req, res) {
  res.render('secret')
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log('console has started!')
})
