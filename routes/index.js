const express = require('express')
const router = express.Router()
var cookieParser = require('cookie-parser')
router.use(cookieParser())

//model
const Users = require('../models/user')

//auth

const jwt = require('jsonwebtoken');
var secret = 'secretpasstoken'

function isLoggined(req, res, next) {
    try {
        var token = req.cookies.token;
        var decodeToken = jwt.verify(token, secret)
        Users.findOne({
            _id: decodeToken
        }).then(data => {
            if (data) {
                req.data = data
                if (data.countlogin === '0') {
                    return res.render('firstLogin', { username: data.username })
                }
                next()
            }
        }).catch(err => {
            console.log(err)
        })
    } catch (error) {
        return res.redirect('/auth/login')
    }
}

router.get('/', isLoggined, (req, res) => {
    res.render('index')
})

module.exports = router
