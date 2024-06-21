const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./server/config/key');

const { User } = require('./server/models/User');
const { auth } = require('./server/middleware/auth');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

// Register
app.post('/api/users/register', async (req, res) => {
    // put the data to DB from client
    const user = new User(req.body);

    try {
        const userInfo = await user.save();
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, err });
    }
});

// Login
app.post('/api/users/login', async (req, res) => {
    try {
        // Finds if the requested email is in the database
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "There is no user matching the provided email."
            });
        }

        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "Password is not correct."
            });
        }

        const tokenUser = await user.generateToken();
        res.cookie("x_auth", tokenUser.token)
            .status(200)
            .json({ loginSuccess: true, userId: tokenUser._id });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ loginSuccess: false, err });
    }
});

// Auth ( role 0 -> normal user, else admin)
app.get('/api/users/auth', auth , (req, res) => {

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
});

// Logout
app.get('/api/users/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user._id }, { token: "" }).exec();
        return res.status(200).send({
            success: true
        });
    } catch (err) {
        return res.json({
            success: false, err
        });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
