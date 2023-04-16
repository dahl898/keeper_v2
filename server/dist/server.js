"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./database/config"));
const crypto_1 = __importDefault(require("crypto"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const middlewares_1 = require("./middlewares/middlewares");
const authFunctions_1 = require("./utils/authFunctions");
const path_1 = __importDefault(require("path"));
const Account = config_1.default.models.Account;
const User = config_1.default.models.User;
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGOURL }),
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: false //if set to false, then browser can read a cookie sent from the server (not safe)
    }
}));
require("./passport/config");
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../client/build', "index.html"));
});
app.get('/api', middlewares_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doc = yield Account.findOne({ username: (_a = req.user) === null || _a === void 0 ? void 0 : _a.username });
    res.send(JSON.stringify(doc === null || doc === void 0 ? void 0 : doc.notes));
}));
app.get('/login', middlewares_1.auth, (req, res) => {
    res.send(JSON.stringify({ isAuth: true }));
});
app.post('/login', passport_1.default.authenticate('local', { successRedirect: 'login-success', failureRedirect: 'login-failure' }), (req, res) => { });
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exUser = yield User.findOne({ username: req.body.username });
    if (exUser) {
        res.send(JSON.stringify({ isAuth: false, msg: 'Account with such username already exists' }));
    }
    else {
        const saltHash = (0, authFunctions_1.genPassword)(req.body.password);
        const user = new User({
            username: req.body.username,
            hash: saltHash.hash,
            salt: saltHash.salt
        });
        yield user.save();
        res.send(JSON.stringify({ isReg: true }));
    }
}));
app.get('/login-success', (req, res) => {
    console.log('success');
    res.send(JSON.stringify({ isAuth: true }));
});
app.get('/login-failure', (req, res) => {
    res.send(JSON.stringify({ iaAuth: false, failed: true }));
});
app.post('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const id = crypto_1.default.randomBytes(16).toString('hex');
    const data = Object.assign(Object.assign({}, req.body), { _id: id });
    const exAccount = yield Account.findOneAndUpdate({ username: (_b = req.user) === null || _b === void 0 ? void 0 : _b.username }, { $push: { notes: data } });
    if (exAccount) {
        const doc = yield Account.findOne({ username: (_c = req.user) === null || _c === void 0 ? void 0 : _c.username });
        res.send(JSON.stringify(doc === null || doc === void 0 ? void 0 : doc.notes));
    }
    else {
        console.log((_d = req.user) === null || _d === void 0 ? void 0 : _d.username);
        const account = new Account({
            username: (_e = req.user) === null || _e === void 0 ? void 0 : _e.username,
            notes: [{
                    _id: id,
                    title: req.body.title,
                    content: req.body.content
                }]
        });
        yield account.save();
        const doc = yield Account.findOne({ username: (_f = req.user) === null || _f === void 0 ? void 0 : _f.username });
        res.send(JSON.stringify(doc === null || doc === void 0 ? void 0 : doc.notes));
    }
}));
app.delete('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    yield Account.findOneAndUpdate({ username: (_g = req.user) === null || _g === void 0 ? void 0 : _g.username }, { $pull: { notes: { _id: req.body._id } } });
    const doc = yield Account.findOne({ username: (_h = req.user) === null || _h === void 0 ? void 0 : _h.username });
    res.send(doc === null || doc === void 0 ? void 0 : doc.notes);
}));
const port = process.env.PORT;
app.listen(port || 5000, () => {
    console.log(`[server]: Listening on port ${port || 5000}`);
});
