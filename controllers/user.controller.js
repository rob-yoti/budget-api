const { getUserIdFromToken } = require ('./helpers');
const { User } = require('../models/user.model');

function getUser(req, res) {
    User.findById(getUserIdFromToken(req.headers.authorization))
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found!'
                });
            }

            let balance = (user.balance / 100).toFixed(2);
            return res.status(200).json({
                success: true,
                user: {
                    username: user.username,
                    transactions: user.transactions,
                    balance
                }
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err
            });
        })
}

function addTransactionToUser(user, transaction) {
    if (transaction.direction === 'egress') {
        transaction.amount = -Math.abs(transaction.amount);
    }

    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(user, {
            $push: { transactions: transaction._id },
            $inc: { balance: transaction.amount }
        })
        .then(() => resolve(transaction))
        .catch(reject)
    });
}

function removeTransactionFromUser(transaction) {
    if (transaction.direction === 'ingress') {
        transaction.amount = -Math.abs(transaction.amount);
    }

    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(transaction.user, {
            $pull: { transactions: transaction._id },
            $inc: { balance: Math.round(transaction.amount) }
        })
        .then(() => resolve())
        .catch(reject)
    });
}

module.exports = {
    getUser,
    addTransactionToUser,
    removeTransactionFromUser
}
