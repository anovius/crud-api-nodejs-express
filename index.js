const express = require('express')
const app = express()
const path = require('path');
const router = express.Router();
const passport = require('passport')
const express_session = require('express-session')
const flash = require('express-flash')
const methodOverride = require('method-override')
const Student = require('./student')

const auth_users = [new Student("usman", "bcsf18a522", "csf18", "abc123"), new Student("admin", "admin123", "adminbatch", "admin") ]
function checkRollNo(rollno){
  const i = auth_users.findIndex((student) => student.rollNo === rollno)
    if(i === -1){
      return false
    }
    else{
      return true
    }
}
const initializePassport = require('./passportConfig');
const { endianness } = require('os');
initializePassport(
  passport,
  rollNo => auth_users.find(user => user.rollNo === rollNo)
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(express_session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(express.json())
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/login.html'))
})
app.get('/home', function(req, res){
    res.sendFile(path.join(__dirname+'/home.html'))
})
app.post('/addUser', function(req, res){
    const {name} = req.body
    const {rollno} = req.body
    const {batch} = req.body
    const {password} = req.body
    if(!checkRollNo(rollno)){
      const newStudent = new Student(name, rollno, batch, password)
      auth_users.push(newStudent)
      res.status(200).send({msg: 'User Added successfully'})
    }
    else{
      res.status(200).send({msg: 'Can not add user roll no already exists'})
    }
})
app.post('/delete/:rollno', function(req, res){
    const {rollno} = req.params
    const i = auth_users.findIndex((student) => student.rollNo === rollno)
    if(i === -1){
      res.status(200).send({msg: 'User not found'})
    }
    else{
      const  feedback= "User: "+ auth_users[i].name + " Deleted Successfully!"
      auth_users.splice(i,1)
      res.status(200).send({msg: feedback }) 
    }
})
app.get('/getUser/:rollno', function(req, res){
    const {rollno} = req.params
    const user = auth_users.find((student) => student.rollNo === rollno)
    if(typeof user !== 'undefined'){
      res.status(200).send({name: user.name, rollno: user.rollNo, batch: user.batch, password: user.password}) 
    }
    else{
      res.status(200).send({msg: 'User not found'})
    }
})

app.get('/getAllUsers', function(req, res){
    res.status(200).send({users: auth_users})
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home', 
    failureRedirect: '/',
    failureflash: true
}))
app.use('/', router)
app.listen(3000)