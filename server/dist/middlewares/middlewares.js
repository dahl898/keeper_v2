"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
function auth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.send({ isAuth: false });
    }
}
exports.auth = auth;
