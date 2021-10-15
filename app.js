const express = require('express');
const app = express();

//database
const {db, Customer, Booking} = require('./db')
const session = require('express-session');

app.use(session({
    secret: 'kdbfefwefascbasvafjdsvblsdjvlsfvsdjk',
    resave: false,
    saveUninitialized: true
}))


//middlewares for data exchange in proper format, in post requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'hbs');

app.use("/", express.static(__dirname + '/public'));


//signup
app.post('/signup', (req,res)=>{
    if(req.body.email && req.body.pass && req.body.name && req.body.address && req.body.phone){
        Customer.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.pass,
            address: req.body.address,
            phone: req.body.phone
        }).then((user)=>{
            req.session.userID = user.id;
            req.session.email = user.email;
            req.session.name = user.name;
            req.session.phone = user.phone;
            req.session.address = user.address;
            return res.render('yourbookings');
        }).catch((error)=>{
            //throw error;
            return res.render('error', {error, text: "Some error occured, while signing up! Please try again."});
        })
    }
    else{
        return res.render('error', {error: "Please enter all details to sign up!"});
    }
})


//login
app.get('/login', (req, res)=>{
    if(req.session.email){
        res.render('yourbookings');
    }
    else{
        res.render('login');
    }
})

app.get('/login_ess', (req, res)=>{
    if(req.session.userID){
        return res.render('yourbookings');
    }
    else{
        res.render('login', {msg:true});
    }
})

app.get('/isloggedin', (req,res)=>{
    if(req.session.name){
        return res.send("true");
    }
    else{
        return res.send("false")
    };
})

app.post('/login', (req,res)=>{
    if(req.body.email && req.body.pass){
            Customer.findOne({
                where: {email: req.body.email}
            }).then((user)=>{
                if(!user){
                    return res.render('error', {error: "Account does not exist! Please try logging in again with correct email."});
                }
                else if(user.password==req.body.pass){
                    // sab kuch shi hai, then we should create a cookie with userID and redirect to profile
                    req.session.userID = user.id;
                    req.session.email = user.email;
                    req.session.name = user.name;
                    req.session.phone = user.phone;
                    req.session.address = user.address;
                    return res.redirect('/mybookings');
                }
                else{
                    return res.render('error', {error: "Invalid E-mail or Password! Please try logging in again with correct details."});
                }
            }).catch((error)=>{
                console.log(error);
                return res.render('error', {error, text: "Some error occurred! Please try logging in again."});
            })
    }

    else{
        res.render('error', {error: "Please enter all details to login!"});
    }
})


//logout
app.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err) return res.render('error', {err});
            return res.redirect('/');
        })
    }
    else{
        res.redirect('/');
    }
})


//accessing user bookings 
app.get('/mybookings', (req, res)=>{
    //security
    if(!req.session.email){
        return res.redirect('/login_ess');
    }
    
    Booking.findAll({
        // where: {domain: req.query.domain},
        where: {
            email: req.session.email
        }
    }).then((data)=>{
        console.log(data);
        return res.render('yourbookings', {data});
    }).catch((error)=>{
        return res.render('error', {error, text: "Some error occured while loading your bookings. Please try again!"});
    })
})


//booking a plan
app.use('/bookplan/', (req, res)=>{
    if(!req.session.email){
        return res.redirect('/login_ess');
    }
    res.sendFile(__dirname + "/public/booking.html");
})
//booking a package 
app.use('/bookpackage/', (req, res)=>{
    if(!req.session.email){
        return res.redirect('/login_ess');
    }
    res.sendFile(__dirname + "/public/booking.html");
})
//request for user data while booking plan/ package
app.get('/senduser/', (req, res)=>{
    //add security
    res.send(req.session);
})


//booking finalized
app.post('/finalplan/', (req, res)=>{
    // req.body.plan = true;
    //store booking in db
    if(req.body.address && req.body.phone && req.body.date && req.body.people && req.body.amt){
        Booking.create({
            name: req.body.name,
            email: req.body.email,
            places: req.body.destname,
            people: req.body.people,
            cost: req.body.amt,
            date: req.body.date,
            address: req.body.address,
            phone: req.body.phone
        }).then(()=>{
            console.log(req.body);
            return res.render('book_rec', {details: req.body});
        }).catch((error)=>{
            //throw error;
            return res.render('error', {error, text: "Some error occured! Booking failed. Please try again."});
        })
    }
    else{
        return res.render('error', {error: "Please enter all details to make a booking."});
    }
});


//syncing db
db.sync()
    .then(()=>{
        app.listen(4444, ()=>{
            console.log("Server started successfully at http://localhost:4444 ");
        })
})
