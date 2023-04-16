"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accountSchema = new mongoose_1.Schema({
    username: String,
    notes: [{
            _id: String,
            title: String,
            content: String,
        }]
});
const userSchema = new mongoose_1.Schema({
    username: String,
    hash: String,
    salt: String
});
const connection = (0, mongoose_1.createConnection)(`${process.env.MONGOURL}`);
const Account = connection.model('Account', accountSchema);
const User = connection.model('User', userSchema);
exports.default = connection;
