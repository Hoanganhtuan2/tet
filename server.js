const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/lixiapp", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema cho người dùng
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number,
    lixiReceived: Array
});

const User = mongoose.model("User", UserSchema);

// Tạo token cho người dùng
const generateToken = (user) => {
    return jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "1h" });
};

// Đăng ký người dùng
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, balance: 100000, lixiReceived: [] });
    await newUser.save();
    const token = generateToken(newUser);
    res.json({ message: "User registered successfully!", token });
});

// Đăng nhập người dùng
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: "Invalid password!" });
    }

    const token = generateToken(user);
    res.json({ message: "Login successful!", token });
});

// Mở lì xì
app.post("/open-lixi", async (req, res) => {
    const { username, key } = req.body;

    if (!username || !key) {
        return res.status(400).json({ message: "Vui lòng nhập tên và mã lì xì!" });
    }

    const amount = Math.random() > 0.8 ? Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000 : Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found!" });
    }

    user.lixiReceived.push(amount);
    user.balance += amount;
    await user.save();

    res.json({ message: `Chúc mừng ${username}! Bạn đã nhận ${amount}đ lì xì!`, balance: user.balance });
});

// Lấy bảng xếp hạng người dùng
app.get("/leaderboard", async (req, res) => {
    const users = await User.find().sort({ balance: -1 }).limit(10);
    res.json(users);
});

// Chạy server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
