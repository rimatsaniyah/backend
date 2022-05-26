"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = __importDefault(require("./handler"));
const routes = [
    {
        method: 'GET',
        path: '/',
        handler: handler_1.default,
    },
];
exports.default = routes;
