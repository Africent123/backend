const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');



const app = express();

//environment variable or you can say constants
env.config();


// importing db configurations
const dbconfig = require('./config/dbconfig');



// importing routes
const user = require('./routes/user');
const payment = require('./routes/payment');
const file = require('./routes/files');
const upload = require('./routes/upload');
const movies = require('./routes/movies');
const cp = require('./routes/cp');
const watched = require('./routes/watched');


//passport config
require('./config/passport')(passport);


mongoose.connect(dbconfig.dburl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB Database...");
}).catch((err) => {
  console.log(err);
})


//body parser middleware
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());


///Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: null
    }
}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//CORS middleware
app.use(cors());

//flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_mgs');
    res.locals.error_msg = req.flash('error_mgs');
    res.locals.user = req.user || null;
    next();

});


//Morgan Middleware
app.use(morgan('dev'));

//routes
app.use('/api/user', user)
app.use('/api/upload', upload)
app.use('/api/files', file)
app.use('/api/movies', movies)
app.use('/api/cp', cp)
app.use('/api/watched', watched)



//express static middleware
// Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
	 // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static('client/build'));
  
  // index.html for all page routes  html or routing and naviagtion
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..client', 'build', 'index.html'));
  });
}


const port = process.env.PORT || 5000

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});