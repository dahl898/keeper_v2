"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const config_1 = __importDefault(require("../database/config"));
const authFunctions_1 = require("../utils/authFunctions");
const User = config_1.default.models.User;
passport_1.default.use(new passport_local_1.Strategy(function (username, password, done) {
    User.findOne({ username: username })
        .then((user) => {
        if (!user) {
            return done(null, false);
        }
        const isValid = (0, authFunctions_1.validPassword)(password, user.hash, user.salt);
        if (isValid) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
        .catch((err) => {
        return done(err);
    });
}));
passport_1.default.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { username: user.username, id: user._id });
    });
});
passport_1.default.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});
