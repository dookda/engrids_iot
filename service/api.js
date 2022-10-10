const express = require('express')
const app = express()

const condb = require('./db');
const db = condb.db;
const secret = require('./secret');

const jwt = require("jwt-simple");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = secret.secret;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
    const sql = "SELECT username FROM wtrq_user"
    db.query(sql).then(r => {
        if (payload.sub === r.rows[0].username) {
            done(null, true)
        }
        else {
            done(null, false)
        }
    })
});

passport.use(jwtAuth);
const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.post("/api/insertdata", requireJWTAuth, async (req, res) => {
    const { stname, val_ec, val_ph, val_do, val_tmp } = req.body;
    let data = {
        val_ec, val_ph, val_do, val_tmp
    }
    const pid = Date.now();
    await db.query(`INSERT INTO wtrq_iot(stname, pid, ts) VALUES ('${stname}', '${pid}', now())`)
    let d;
    for (d in data) {
        if (data[d]) {
            let sql = `UPDATE wtrq_iot SET ${d}='${data[d]}' WHERE pid='${pid}';`;
            console.log(sql);
            await db.query(sql)
        }
    }
    res.status(200).json({
        data: "insert success"
    })
});

const loginMiddleWare = (req, res, next) => {
    const sql = "SELECT username,password FROM wtrq_user"
    db.query(sql).then(r => {
        console.log(r.rows[0].usrname, r.rows[0].pass);
        if (req.body.username === r.rows[0].username && req.body.password === r.rows[0].password) {
            next()
        } else {
            res.send("Wrong username and password")
        };
    })
};

// app.post("/api/login", loginMiddleWare, (req, res) => {
//     const payload = {
//         sub: req.body.username,
//         iat: new Date().getTime()
//     };
//     res.send(jwt.encode(payload, SECRET));
// });

module.exports = app