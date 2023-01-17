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

app.post("/api/insertdata", async (req, res) => {
    const { stname, val_ec, val_ph, val_do, val_tmp } = req.body;
    let data = {
        val_ec, val_ph, val_do, val_tmp
    }
    const pid = Date.now();
    let sql1 = `INSERT INTO wtrq_iot(stname, pid, ts) VALUES ('${stname}', '${pid}', now())`

    await db.query(sql1)
    let d;
    for (d in data) {
        dnum = Number(data[d])
        let sql = `UPDATE wtrq_iot SET ${d}=${dnum} WHERE pid='${pid}';`;
        if (data[d] && !isNaN(dnum)) {
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

app.get("/api/getalldata", (req, res) => {
    const sql = `select gid,stname,val_ec,val_ph,val_do,val_tmp, TO_CHAR(ts, 'DD-MM-YYYY HH24:MI:ss') as datetime from wtrq_iot`;

    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})


app.post("/api/getone", (req, res) => {
    const { stname, limit } = req.body;
    const sql = `select gid,stname,val_ec,val_ph,val_do,val_tmp, TO_CHAR(ts, 'DD-MM-YYYY HH24:MI:ss') as datetime from wtrq_iot  WHERE stname='${stname}' ORDER BY gid DESC limit ${limit}`;
    console.log(sql)
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/api/wtrq-data", (req, res) => {
    const { stname, param, limit, sort } = req.body;
    const sql = `select gid,stname, ${param}, ts, TO_CHAR(ts, 'DD-MM-YYYY HH24:MI:ss') as datetime from wtrq_iot  WHERE stname='${stname}' ORDER BY ts ${sort} limit ${limit}`;
    console.log(sql)
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})



module.exports = app