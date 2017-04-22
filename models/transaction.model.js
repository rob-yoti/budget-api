const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 12
    },
    direction: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

let Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    Transaction
}
