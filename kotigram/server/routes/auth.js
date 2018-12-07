const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const User = require('../models/User');
const config = require('../config');

const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
    console.log(req.body);
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
        fullname: req.body.fullname,
        nickname: req.body.nickname.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
    });

    user.save()
        .then(user => {
            const token = jwt.sign({ id: user._id }, config.key, {
                expiresIn: 36000 // 1h
            });
            res.status(200).send({ token, user: { fullname: user.fullname, nickname: user.nickname, id: user._id }});
        })
        .catch(err => {
            //handle errors
            res.status(500).send({ message: 'Something went wrong' })
        })
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase() })
        .then(user => {
            if (!user) return res.status(404).send({ message: 'User was not found' });
            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordValid) return res.status(401).send({ message: 'Invalid login or password' });
            const token = jwt.sign({ id: user._id }, config.key, {
                expiresIn: 36000 // 1h
            });
            res.status(200).send({ token, user: { fullname: user.fullname, nickname: user.nickname, id: user._id }})
        })
});

module.exports = router;
