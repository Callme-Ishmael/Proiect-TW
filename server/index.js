console.log("NodeJS Backend ....")

// Import packages
const path = require('path')
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require('express-session')
const fs = require("fs")
// const cors = require("cors");

// Aplicatia
const app = express();
const PORT = "3000";

app.set('views', path.join(path.dirname(__dirname), 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
// app.use(cors());
app.use(express.static("public/"));
app.use(session({ secret: 'my secret cookie secret', cookie: { maxAge: 60 * 60 * 1000 }}))


function badRequest(data) {
    return {status: 'BAD', data: data}
}

function validRequest(data) {
    return {status: 'OK', data: data}
}

function getCursuri() {
    return JSON.parse(fs.readFileSync("server/cursuri.json"))
}

function saveCursuri(cursuri) {
    fs.writeFileSync("server/cursuri.json", JSON.stringify(cursuri, null, 1))
}

function getAccounts() {
    return JSON.parse(fs.readFileSync("server/users.json"))
}

function saveAccounts(accs) {
    fs.writeFileSync("server/users.json", JSON.stringify(accs, null, 1))
}

app.get('/cursuri', (req, res) => {
    const CURSURI = getCursuri()
    res.send(validRequest(CURSURI))
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

app.listen(PORT, () =>
  console.log("Server started at: http://localhost:" + PORT)
);



// // Requiring module
// const express = require("express")
// const app = express()
  
// // Handling GET /hello request
// app.get("/hello", (req, res, next) => {
//     res.send("This is the hello response");
// })
  
// // Handling non matching request from the client
// app.use((req, res, next) => {
//     res.status(404).send(
//         "<h1>Page not found on the server</h1>")
// })
  
// // Server setup
// app.listen(3000, () => {
//     console.log("Server is Running")
// })