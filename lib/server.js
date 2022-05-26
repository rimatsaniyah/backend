"use strict";
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
exports.start = exports.init = exports.server = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const routes_1 = __importDefault(require("./routes"));
const users_1 = __importDefault(require("./plugins/users"));
const posts_1 = __importDefault(require("./plugins/posts"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const init = function () {
    return __awaiter(this, void 0, void 0, function* () {
        exports.server = hapi_1.default.server({
            port: process.env.PORT || 4000,
            host: 'localhost',
        });
        yield exports.server.register([prisma_1.default, users_1.default, posts_1.default]);
        // Routes will go here
        exports.server.route(routes_1.default);
        return exports.server;
    });
};
exports.init = init;
const start = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Listening on http://${exports.server.settings.host}:${exports.server.settings.port}`);
        return exports.server.start();
    });
};
exports.start = start;
process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection');
    console.error(err);
    process.exit(1);
});
