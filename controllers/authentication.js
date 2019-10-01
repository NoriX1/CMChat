const jwt = require('jwt-simple');
const User = require('../models/user');
const keys = require('../config/keys');
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


function tokenForUser(user) {
    const timestamp = new Date().getTime();
    // sub --> subject; iat --> issued at time
    return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

exports.signup = function (req, res, next) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).send({ error: 'You must provide all required fields!' });
    }
    if (!/^[A-Za-zА-Я-а-я0-9_]+$/.test(name)) {
        return res.status(422).send({ error: "Only letters and numbers (and _ ) are allowed in name" });
    }
    if (name.length > 10) {
        return res.status(422).send({ error: "Max length of name is 10 characters" });
    }

    if (!re.test(email)) {
        return res.status(422).send({ error: "Email is invalid" });
    }

    User.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        User.findOne({ name: name }, (err, existingUser) => {
            if (err) { return next(err); }

            if (existingUser) {
                return res.status(422).send({ error: `Name "${name}" is already is in use` });
            }
            
            const user = new User({
                name: name,
                email: email,
                password: password
            });

            user.save((err) => {
                if (err) { return next(err); }
                res.json({ token: tokenForUser(user) });
            });
        });
    });
}

exports.signin = function (req, res, next) {
    //Users has already had their email and password auth`d
    //We just need to give them a token
    res.send({ token: tokenForUser(req.user) });

}

exports.signInGoogle = function (req, res, next) {
    res.redirect(`${keys.clientURI}/google/` + tokenForUser(req.user));
}

exports.sendUser = function (req, res, next) {
    const user = new User({
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
    res.send(user);
}