// server/index.js
require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.url);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요~주현욱입니다!')
})

app.get('/api/hello', (req, res) => res.send("안녕하세요~ 주현욱입니다! (/api/hello)"));

app.post('/api/users/register', async (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.status(200).json({
      success: true, user: savedUser
    });
  } catch (err) {
    return res.status(500).json({
      success: false, err
    });
  }
})

app.post('/api/users/login', async (req, res) => {
  try {
    // 1.요청된 이메일을 데이터베이스에서 있는지 찾는다.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    // 2.요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인한다.
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
    }

    // 3.비밀번호까지 맞다면 토큰을 생성한다.
    const tokenUser = await user.generateToken();

    // 토큰을 저장한다.
    res.cookie("x_auth", user.token)
      .status(200)
      .json({ loginSuccess: true, userId: user._id })
  } catch (err) {
    return res.status(500).json({ loginSuccess: false, error: err.message });
  }
});

app.get('/api/users/auth', auth, async (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })
  } catch (err) {
    return res.status(500).json({ AuthSuccess: false, error: err.message });
  }
})

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" }
    );
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).json({ LogoutSuccess: false, error: err.message });
  }
});


const port = 5000
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
}) 