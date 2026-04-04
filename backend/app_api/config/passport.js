const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'IDnumber',
            passwordField: 'password'
        },
        (IDnumber, password, done) => {
            User.findOne({ IDnumber })
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    }

                    if (!user.validatePassword(password)) {
                        return done(null, false);
                    }

                    return done(null, user);
                })
                .catch((err) => {
                    return done(err);
                });
        }
    )
);