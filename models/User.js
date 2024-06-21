const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function( next ){
    var user = this;
    // encrypt the password

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function (err, salt){
            if (err) return next(err);

            // hash the password using new salt
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);

                // override 
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// userSchema.methods.comparePassword = function(plainPassword, cb){
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if(err) return cb(err),
//         cb(null, isMatch)
//     })
// };

userSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function(){
    // Create token using json web token
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    
    // user._id + 'secretToken' = token

    user.token = token;
    // user.save(function(err, user){
    //     if(err){
    //         return cb(err)
    //     }
    //     cb(null, user);
    // })

    return user.save().then(user => user);
};

userSchema.statics.findByToken = async function(token) {
    var user = this;



    // jwt.verify(token, 'secretToken', function(err, decoded){
    //     user.findOne({"_id": decoded, "token": token}, function (err, user){
    //         if(err){
    //             return cb(err);
    //         }
    //         cb(null, user);
    //     })
    // });

    try {
        const decoded = jwt.verify(token, 'secretToken');
        const foundUser = await user.findOne({ "_id": decoded, "token": token }).exec();
        return foundUser;
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = { User };