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
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * TODO: We can't use this type because it is available only in 2.11.0 and previous versions
 * In 2.12.0, this will be namespaced under Prisma and can be used as Prisma.UserCreateInput
 * Once 2.12.0 is release, we can adjust this example.
 */
// import { UserCreateInput } from '@prisma/client'
// plugin to instantiate Prisma Client
const usersPlugin = {
    name: 'app/users',
    dependencies: ['prisma'],
    register: function (server) {
        return __awaiter(this, void 0, void 0, function* () {
            server.route([
                {
                    method: 'POST',
                    path: '/signup',
                    handler: signupHandler,
                },
            ]),
                server.route([
                    {
                        method: 'GET',
                        path: '/users',
                        handler: getAllUsersHandler,
                    },
                ]),
                server.route([
                    {
                        method: 'GET',
                        path: '/user/{userId}/drafts',
                        handler: getDraftsByUserHandler,
                    },
                ]);
        });
    },
};
exports.default = usersPlugin;
function signupHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const { name, email, posts } = request.payload;
        const postData = posts === null || posts === void 0 ? void 0 : posts.map((post) => {
            return { title: post === null || post === void 0 ? void 0 : post.title, content: post === null || post === void 0 ? void 0 : post.content };
        });
        try {
            const createdUser = yield prisma.user.create({
                data: {
                    name,
                    email,
                    posts: {
                        create: postData,
                    },
                },
            });
            return h.response(createdUser).code(201);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getAllUsersHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        try {
            const users = yield prisma.user.findMany();
            return h.response(users).code(200);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getDraftsByUserHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const userId = String(request.params.userId);
        try {
            const drafts = yield prisma.user
                .findUnique({
                where: { id: userId },
            })
                .posts({
                where: { published: false },
            });
            return h.response(drafts).code(200);
        }
        catch (err) {
            console.log(err);
        }
    });
}
