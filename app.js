var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var hbs=require('express-handlebars')
var fileUpload=require('express-fileupload')

var studentRouter = require('./routes/student');
var tutorRouter = require('./routes/tutor');
var adminRouter = require('./routes/admin');

var app = express();


var db = require('./config/connection')

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })


//hbs helper
const exhbs=hbs.create({
    extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/',partialsDir:__dirname+'/views/partials',
    helpers:{
        iff:(a,b,options)=>{
            console.log('A:B',a,b);
            a=a.toString();
            b=b.toString();
            if(a===b){
                return options.fn({status:true})
            }
        }
    }
})




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',exhbs.engine)




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"Key",cookie:{maxAge:60000000}}))
app.use(fileUpload())

db.connect((err) => {
    if (err) console.log("Connecton err" + err);
    else console.log("Mongodb Connected to port 27017");
})

app.use('/', studentRouter);
app.use('/tutor', tutorRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;