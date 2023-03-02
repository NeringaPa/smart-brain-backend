const express = require('express'); 
const cors = require('cors');
const dotenv = require('dotenv');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const { authenticateToken } = require('./middlewares/verifyAuth');

dotenv.config();
//console.log(process.env);
  
const app = express();

app.use(express.json()); 
//app.use(express.urlencoded({extended:false}));
app.use(cors());

app.get('/', authenticateToken, (req, res) => {res.send('It is working!')});

app.post('/signin', signin.handleSignin);

app.post('/register', register.handleRegister);

app.get('/profile/:id',authenticateToken, profile.handleProfileGet);

app.put('/image',authenticateToken, image.handleImage);

app.post('/imageurl',authenticateToken, image.handleApiCall);

app.listen(3000, (err)=>{
  if (err) console.log(err);
  console.log("Server listening on PORT 3000");
});

// app.listen(process.env.PORT || 3000, (err)=>{
//   if (err) console.log(err);
//   console.log("Server listening on PORT " + process.env.PORT);
// });