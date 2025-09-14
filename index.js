import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import cookieParser from 'cookie-parser'
import http from "http";
import initSocket from "./socket/socket.js";
import connectDb from './db/db.js'
import authRoutes from './routes/authRoutes.js'
import errMiddleware from './middleware/errMiddleware.js'
import authMiddleware from './middleware/authMiddleware.js'
import {
    fetchUser,
    fetchConversation
} from "./routes/userFunction.js"
import {
    fetchMessage
} from "./routes/messageFunction.js"

const app = express()
await dotenv.config()
const PORT = process.env.PORT || 3000
// Create HTTP server
const server = http.createServer(app);

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.use(cookieParser())
app.set("view engine", "ejs")
app.set("views", path.join(process.cwd(), "views"));

// Error middleware
app.use(errMiddleware)

app.get('/', authMiddleware, async(req, res)=> {
    const userData = await req.user
    const users = await fetchUser()
    const conversations = await fetchConversation(userData.name)
    
    console.log('conversations',conversations)
    
    res.render('users', {
        userData,
        users,
        conversations
    })
})

app.get('/message/:receiver', authMiddleware, async(req, res)=> {
    const userData = await req.user
    const receiver = req.params.receiver
    const messages = await fetchMessage(userData.name, receiver)
    res.render('message', {
        userData,
        receiver,
        messages
    })
})

app.use('/auth', authRoutes)

// Start socket.io server
initSocket(server);

// Wait for database to connect and run server
await connectDb()
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});