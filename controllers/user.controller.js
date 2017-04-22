const { getUserIdFromToken } = require ('./helpers');
const { User } = require('../models/user.model');

function getUser(req, res) {
    User.findById(getUserIdFromToken(req.headers.authorization))
        .then((user) => {
            return res.status(200).json({
                success: true,
                user: {
                    username: user.username,
                    transactions: user.transactions,
                    balance: user.balance
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
        .catch((err) => reject(err))
    });
}

module.exports = {
    getUser,
    addTransactionToUser
}
