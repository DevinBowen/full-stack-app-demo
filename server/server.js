require('dotenv').config();
const express = require('express')
    ,bodyParser = require('body-parser')
    ,session = require('express-session')
    ,passport = require('passport')
    ,Auth0Strategy = require('passport-auth0')
    ,massive = require('massive');


const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTION_STRING).then( (db) => {
    app.set('db',db);
})


passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL,
    scope: 'openid profile'
}, function(accessToken, refresjToken, extraParams, profile, done){
    let {_json} = profile;

    let {displayName, user_id, picture} = profile;
    const db = app.get('db')

    db.find_user(user_id).then(function(user) {
        // console.log(user)
        if (!user[0]) {
            db.create_user([
                displayName,
                'test@email.com',
                picture,
                user_id
            ]).then(user => {
                return done(null, user[0].id)
            })
        } else {
            return done(null, user[0].id)
        }
    })

}))

passport.serializeUser((id, done) => {
    done(null, id);
})
passport.deserializeUser((id, done) => {
    app.get('db').find_session_user(id).then(function(user) {
        return done(null,user[0])
    })
})


// ---END POINTS---
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/private',
    failureRedirect: 'http://localhost:3000/'
}));
app.get('/auth/me', (req,res) => {
    if (!req.user) {
        res.status(404).send('user not found');
    } else {
        res.status(200).send(req.user);
    }
})

app.get('/auth/logout', function(req,res) {
    req.logOut();
    res.redirect('http://localhost:3000/')
})


const {SERVER_PORT} = process.env
app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}!`)
});




