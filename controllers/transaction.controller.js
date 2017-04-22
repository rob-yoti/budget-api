const mongoose = require('mongoose');

const { getUserIdFromToken } = require('./helpers');
const { addTransactionToUser } = require('./user.controller');
const { Transaction } = require('../models/transaction.model');

function getTransaction(req, res) {
    Transaction.findById(req.params.id)
        .then((transaction) => {
            return res.status(200).json({
                success: true,
                transaction
            });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: `The transaction ID "${err.value}" is not in the expected format.`
                });
            }

            res.status(500).json({
                success: false,
                message: err
            });
        })
}

function createTransaction(req, res) {
    let { name, direction, amount, currency } = req.body;
    if (!name || !direction || !amount || !currency) {
        return res.status(400).json({
            success: false,
            message: 'Missing required information.'
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'The amount must be a positive number.'
        });
    }

    let user = getUserIdFromToken(req.headers.authorization);
    let timeStamp = Date.now();
    let newTransaction = new Transaction({
        name,
        direction,
        amount,
        currency,
        user,
        timeStamp
    });

    newTransaction.save()
        .then(addTransactionToUser.bind(null, user))
        .then((transaction) => {
            return res.status(201).json({
                success: true,
                transaction
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err
            });
        })
}

module.exports = {
    getTransaction,
    createTransaction
}
