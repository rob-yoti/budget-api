const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

userSchema.statics.encrypt = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

let User = mongoose.model('User', userSchema);

module.exports = {
    User
}
