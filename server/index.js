console.log("NodeJS Backend ....")

// Import packages
const path = require('path')
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts');
const fs = require("fs")
// const cors = require("cors");

// Aplicatia
const app = express();
const PORT = "3000";

app.set('view engine', 'ejs');

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(expressLayouts);
app.use(express.static("public/"));
app.use(session({ secret: 'my secret cookie secret', cookie: { maxAge: 60 * 60 * 1000 }}))


function badRequest(data) {
    return {status: 'BAD', data: data}
}

function validRequest(data) {
    return {status: 'OK', data: data}
}

function getCursuri() {
    return JSON.parse(fs.readFileSync("server/data/cursuri.json"))
}

function saveCursuri(cursuri) {
    fs.writeFileSync("server/data/cursuri.json", JSON.stringify(cursuri, null, 1))
}

function getAccounts() {
    return JSON.parse(fs.readFileSync("server/data/users.json"))
}

function saveAccounts(accs) {
    fs.writeFileSync("server/data/users.json", JSON.stringify(accs, null, 1))
}

app.get("/", (req, res) => {

    console.log("indeeeeeex")
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get('/cursuri', (req, res) => {
    const CURSURI = getCursuri()
    res.send(validRequest(CURSURI))
})

app.get("/curs", (req, res) => {
    const c_id = req.query["curs_index"]
    const curs = getCursuri()[c_id]

    res.render("curs", {curs: curs})
})

app.get('/user/info', (req, res) => {
    if (req.session.user) {
        res.send(validRequest({
            authenticated: true, 
            user: req.session.user
        }))
        return 
    }
    res.send(validRequest({
        authenticated: false
    }))
})

app.post('/user/login', (req, res) => {
    const {user, password} = req.body
    const Users = getAccounts()
    for (let idx in Array.from(Users)) {
        const acc = Users[idx]
        if (acc.user == user && acc.password == password) {
            req.session.user = acc
            return res.send(validRequest({msg: "success"}))
        }
    }
    res.send(badRequest({msg: "Wrong password or username"}))
})

app.get('/user/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

app.post('/user/create', (req, res) => {
    const {user, password} = req.body
    const Users = getAccounts()
    console.log("Users")
    console.log(Users)
    for (let idx in Array.from(Users)) {
        const acc = Users[idx]
        console.log(acc)
        if (acc['user'] == user)
            return res.send(badRequest({msg: "Username taken"}))
    }
    Users.push({user: user, password: password})
    saveAccounts(Users)
    return res.send(validRequest({msg: "Account created"}))
})

app.use((req, res, next) => {
    res.status(404).render('404');
})


function createDB()
{
    fs.mkdirSync('./server/data', { recursive: true }, (err) => {
        if (err) throw err;
    }); 
    
    /// create/touch the files
    const filenames = ['users.json', 'cursuri.json'];
    const time = new Date();
    
    filenames.forEach(filename => {
        filename = './server/data/' + filename;
        try {
            fs.utimesSync(filename, time, time);
        } catch (err) {
            fs.closeSync(fs.openSync(filename, 'w'));
        }
    });

    saveAccounts([]);
}

createDB()

app.listen(PORT, () =>
  console.log("Server started at: http://localhost:" + PORT)
);



