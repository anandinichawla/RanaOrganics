
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var path = require('path');
var app = express();
const hbs = require('hbs');
const Product = require('./models/product'); 
const session = require('express-session'); 
const csrf = require('csurf');
var csrfProtection = csrf({ cookie: true }); 
const passport = require('passport');
const cflash = require('connect-flash');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
require('./config/passport')(passport);
const User = require('./models/User');
const Cart = require('./models/cart'); 
const Order = require('./models/order');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var url = 'mongodb://heroku_k32zl7f7:hmnjbost683duisu6ajdq5ta6v@ds153677.mlab.com:53677/heroku_k32zl7f7'; 
mongoose.connect(url, { useNewUrlParser: true }
).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err)); 

var store = new MongoDBStore({ mongooseConnection: mongoose.connection });

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const parseForm = bodyParser.urlencoded({ extended: false }); 
app.use(parseForm);
app.use(bodyParser.json());
const sessionOptions = { 
	secret: 'qwertyuiop', 
	saveUninitialized: false, 
  resave: false,
  cookie: {
    maxAge: 180 * 60 * 1000 
  },
  store: store, 
};
app.use(session(sessionOptions));
app.use(cflash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.session = req.session; 
  next();
});

// app.use(csrfProtection);


// app.use(function (err, req, res, next) {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err); 

//   // handle CSRF token errors here
//   res.status(403);
//   res.send('form tampered with'); 
// });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

hbs.registerPartials(__dirname + '/views/partials');



app.get('/', (req, res) => {
  
  const successMessage = req.flash('success')[0]; 
  Product.find({}, function(err,docs){
    if (err) {
      res.status(500).json({ error: '....' });
    } else {
      
      res.render('shop', {products: docs, successMessage: successMessage });
    }
  });

});

//addtocart 

app.get('/add-to-cart/:id', function(req, res, next){
    //  let productId 
    let productId = req.params.id; 
    let cart = new Cart(req.session.cart ? req.session.cart : {}); 

    Product.findById(productId, function(err, product){
       if(err){
         return res.redirect('/'); 
       }
       cart.add(product, product.id); 
       req.session.cart = cart; 
       res.redirect('/'); 
    }); 
});

app.get('/shoppingcart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shoppingcart', {products: null}); 
  }
  let cart = new Cart(req.session.cart); 
  res.render('shoppingcart',{products: cart.generateArray(), totalPrice: cart.totalPrice })
}); 

app.get('/delete/:id', function(req,res,next){

  let productId = req.params.id; 
  let cart = new Cart(req.session.cart ? req.session.cart: {}); 

  cart.deleteItem(productId); 
  req.session.cart = cart; 
  res.redirect('/shoppingcart'); 
}); 

//signin page 
app.get('/signin', (req,res) => {
  res.render('signin');
}); 
 

// Login Page
app.get('/login', forwardAuthenticated, (req, res) => {
  // var messages = req.flash('error');
  
  res.render('login'); 
});

// Register Page
app.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
app.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = "";

  if (!name || !email || !password || !password2) {
    errors = 'Please enter all fields' ; 
  }

  if (password != password2) {
    errors = 'Passwords do not match' ;
  }

  if (password.length < 6) {
    errors = 'Password must be at least 6 characters' ; 
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors = 'Email already exists' ;
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

app.get('signin',forwardAuthenticated, (req,res,next) =>{
  res.render('signin');
}); 
app.get('/profile', ensureAuthenticated, (req,res,next) => {
  Order.find({user: req.user}, function (err, orders) {
    if(err){
      return res.write('Error!'); 
    }
    let cart; 
    orders.forEach(function(order){
        cart = new Cart(order.cart); 
        order.items = cart.generateArray(); 
    }); 
    res.render('profile',{orders:orders, user: req.user.name}); 
  }); 
  
});

// Login
app.post('/login', (req, res, next) => {
  // console.log(req.flash('success_msg'));
  // console.log(req.flash('error_msg'));
  // console.log(req.flash('error'));
  console.log(res.locals);
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

//checkout
app.get('/checkout', ensureAuthenticated, (req,res, next) => {
  if(!req.session.cart){
     return res.redirect('shoppingcart'); 
  }
  const cart = new Cart(req.session.cart); 
  const errorMessage = req.flash('error')[0]; 
  res.render('checkout', {totalPrice: cart.totalPrice, errorMessage: errorMessage, noError: !errorMessage});
}); 

app.post('/checkout', ensureAuthenticated, (req,res, next) =>{

  if(!req.session.cart){
    return res.redirect('/shoppingcart'); 
  }

  const cart = new Cart(req.session.cart);
  
  const stripe = require('stripe')('sk_test_0WwsjIoTipv49yGC2FfXVCJd00bq2QWnQT');

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express
  stripe.charges.create({
          amount: cart.totalPrice * 100,
          currency: 'usd',
          description: 'Example charge',
          source: token,
          statement_descriptor: 'Custom descriptor',
        }, function(err, charge){
            //console.log("charge id is = " + charge.id); 
            if(err){
              req.flash('error', err.message); 
              return res.redirect('/checkout');
            }
            const order = new Order({
              user: req.user,
              cart: cart, 
              address: req.body.address, 
              name: req.body.name,
              paymentId: charge.id
            }); 
            
            order.save(function(err, result){
              if(err){
                return res.redirect('/checkout');
              }
              req.flash('success',' Order placed!! Yummys are coming soon:))'); 
              req.session.cart = null; 
              res.redirect('/');
            }); 
            
        }); 
      
  
}); 
  // }); 






const PORT = process.env.PORT || 3000; 

app.listen(PORT, function(){
  console.log("the app is listening on 3000");
});


module.exports = app;
