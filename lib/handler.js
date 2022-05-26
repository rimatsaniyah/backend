"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index = (request) => {
    console.log('Processing request', request.info.id);
    return 'Hello! Nice to have met you.';
};
exports.default = index;
