const express = require('express')


const cookieParser = require('cookie-parser')

const bodyParser = require('body-parser')

const authRoutes = require('./routes/authRoutes')

const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')

const {requireAuth, checkUser} = require('./middlewares/authMiddlewares')


const app= express();

app.use(bodyParser.json()) // for parsing application/json

app.use(bodyParser.urlencoded({extended: true}))

app.use(authRoutes)

app.use(express.static('public'))

app.use(cookieParser());

// app.use(bodyParser())

app.use(express.json())

app.set('view engine' , 'ejs')

const dbURI ='mongodb+srv://aojha:JwACEgY2w8K7YPwV@cluster0.1mszomg.mongodb.net/jwt2'
// "mongodb://localhost:27017/jwt"

mongoose.connect(dbURI , {
    useNewUrlParser : true,
    useUnifiedTopology:true
    //useCreateIndex:true
}).then(result => {
    app.listen(5000 , () => {
        console.log("server is running on port 5000")
    })
}).catch((err) => {
    console.log(err)
})


app.get('*', checkUser);


app.get('/', (req, res) => {
   const token = req.cookies.jwt;
   if(token){
    jwt.verify(token, 'secret' , (err, decodedToken)=>{
     if(err){
        res.redirect('login');
     } else{
        res.render('dashboard');
     }
    });
   }else{
    res.render('login');
   }
});

app.get('/dashboard',requireAuth, (req, res) => {
    res.render('dashboard')
})