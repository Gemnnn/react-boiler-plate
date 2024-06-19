const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://brandenmin:kYw2Bg3Q0YAA5DA7@boilerplate.yzomgli.mongodb.net/')
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/register', async (req, res) => {
    // put the data to DB from client
    const user = new User(req.body);

    try {
        const userInfo = await user.save();
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
