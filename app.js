const express = require('express');
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT;

const connectDB = require('./configs/connectDB');
connectDB.connectDB();


app.use(
  cors({
    origin: "*", // Hoặc '*' cho tất cả các nguồn
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Cho phép gửi cookie qua các nguồn
    optionsSuccessStatus: 204, // Trả về mã trạng thái 204 No Content nếu tất cả đều ổn
  })
);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/friendship', require('./routes/friendshipRoutes'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
