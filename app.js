const express = require('express')
const http = require('http')
const socketIo = require('./configs/socket')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

// Import các route cần thiết
const authRoutes = require('./routes/authRoutes')
const friendshipRoutes = require('./routes/friendshipRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const destinationRoutes = require('./routes/destinationRoutes')
const userRoutes = require('./routes/userRoutes')
const reactionRoutes = require('./routes/reactionRoutes')
const searchRoutes = require('./routes/searchRoutes')
const notifyRoutes = require('./routes/notifyRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authAdminRoutes = require('./routes/authAdminRoutes')
const favoriteRoutes = require('./routes/favoriteRoutes')

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo.init(server)

const port = process.env.PORT || 3000

// Kết nối đến cơ sở dữ liệu
const connectDB = require('./configs/connectDB')
connectDB.connectDB()

app.use(
  cors({
    origin: '*', // Hoặc '*' cho tất cả các nguồn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép gửi cookie qua các nguồn
    optionsSuccessStatus: 204, // Trả về mã trạng thái 204 No Content nếu tất cả đều ổn
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// WebSocket
io.on('connection', (socket) => {
  console.log('A user connected')

  // Xử lý sự kiện khi ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })

  // Thêm các xử lý sự kiện khác tại đây nếu cần
})

// Định tuyến cho các API
app.get('/', (req, res) => {
  res.send('Hello, Express!')
})
app.use('/api/auth', authRoutes)
app.use('/api/auth/admin', authAdminRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/friendship', friendshipRoutes)
app.use('/api', postRoutes)
app.use('/api', commentRoutes)
app.use('/api', notifyRoutes)
app.use('/api', favoriteRoutes)
app.use('/api/travel', destinationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/reaction', reactionRoutes)
app.use('/api/search', searchRoutes)

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
