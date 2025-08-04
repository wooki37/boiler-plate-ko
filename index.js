require('dotenv').config();

const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const { User } = require("./models/User");
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요~주현욱입니다!')
})

app.post('/register', async (req, res) => {
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
}) 