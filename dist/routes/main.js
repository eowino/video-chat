"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
exports.mainRouter = express_1.Router();
exports.mainRouter.get('/', (_, res) => {
    res.redirect(`${uuid_1.v4()}`);
});
exports.mainRouter.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});
