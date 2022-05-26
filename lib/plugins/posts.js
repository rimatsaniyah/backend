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
 * In 2.12.0, this will be namespaced under Prisma and can be used as Prisma.PostGetPayload
 * Once 2.12.0 is release, we can adjust this example.
 */
// import { PostGetPayload } from '@prisma/client'
// plugin to instantiate Prisma Client
const usersPlugin = {
    name: 'app/posts',
    dependencies: ['prisma'],
    register: function (server) {
        return __awaiter(this, void 0, void 0, function* () {
            server.route([
                {
                    method: 'POST',
                    path: '/post',
                    handler: createPostHandler,
                },
            ]);
            server.route([
                {
                    method: 'GET',
                    path: '/feed',
                    handler: feedHandler,
                },
            ]);
            server.route([
                {
                    method: 'GET',
                    path: '/post/{postId}',
                    handler: getPostHandler,
                },
            ]);
            server.route([
                {
                    method: 'PUT',
                    path: '/publish/{postId}',
                    handler: togglePublishHandler,
                },
            ]);
            server.route([
                {
                    method: 'DELETE',
                    path: '/post/{postId}',
                    handler: deletePostHandler,
                },
            ]);
            server.route([
                {
                    method: 'PUT',
                    path: '/post/{postId}/views',
                    handler: viewIncrementHandler,
                },
            ]);
        });
    },
};
exports.default = usersPlugin;
function feedHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const { searchString, skip, take, orderBy } = request.query;
        const or = searchString
            ? {
                OR: [
                    { title: { contains: searchString } },
                    { content: { contains: searchString } },
                ],
            }
            : {};
        try {
            const posts = yield prisma.post.findMany({
                where: Object.assign({ published: true }, or),
                include: { author: true },
                take: Number(take) || undefined,
                skip: Number(skip) || undefined,
                orderBy: {
                    updatedAt: orderBy || undefined,
                },
            });
            return h.response(posts).code(200);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getPostHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const postId = String(request.params.postId);
        try {
            const post = yield prisma.post.findUnique({
                where: { id: postId },
            });
            return h.response(post || undefined).code(200);
        }
        catch (err) {
            console.log(err);
        }
    });
}
function togglePublishHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const postId = String(request.params.postId);
        try {
            const postData = yield prisma.post.findUnique({
                where: { id: postId },
                select: {
                    published: true,
                },
            });
            const updatedPost = yield prisma.post.update({
                where: { id: postId || undefined },
                data: { published: !(postData === null || postData === void 0 ? void 0 : postData.published) },
            });
            return h.response(updatedPost || undefined).code(201);
        }
        catch (err) {
            console.log(err);
            return h.response({
                error: `Post with ID ${postId}es not exist in the database`,
            });
        }
    });
}
function deletePostHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const postId = String(request.params.postId);
        try {
            const post = yield prisma.post.delete({
                where: { id: postId },
            });
            return h.response(post || undefined).code(201);
        }
        catch (err) {
            console.log(err);
            return h.response({
                error: `Post with ID ${postId}es not exist in the database`,
            });
        }
    });
}
function viewIncrementHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const postId = String(request.params.postId);
        try {
            const post = yield prisma.post.update({
                where: { id: postId },
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
            return h.response(post).code(201);
        }
        catch (err) {
            console.log(err);
            return h.response({
                error: `Post with ID ${postId}es not exist in the database`,
            });
        }
    });
}
function createPostHandler(request, h) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prisma } = request.server.app;
        const payload = request.payload;
        try {
            const createdPost = yield prisma.post.create({
                data: {
                    title: payload.title,
                    content: payload.content,
                    author: {
                        connect: { email: payload.authorEmail },
                    },
                },
            });
            return h.response(createdPost).code(201);
        }
        catch (err) {
            console.log(err);
        }
    });
}
