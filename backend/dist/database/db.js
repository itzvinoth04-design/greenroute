"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Ensure SQLite database file is writable on Vercel Serverless environment (/tmp)
if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    const possibleSourcePaths = [
        path_1.default.join(process.cwd(), 'backend', 'prisma', 'dev.db'),
        path_1.default.join(process.cwd(), 'prisma', 'dev.db'),
        path_1.default.join(__dirname, '..', '..', 'prisma', 'dev.db'),
    ];
    if (!fs_1.default.existsSync(tmpDbPath)) {
        for (const src of possibleSourcePaths) {
            if (fs_1.default.existsSync(src)) {
                try {
                    fs_1.default.copyFileSync(src, tmpDbPath);
                    break;
                }
                catch (err) {
                    console.warn('Could not copy db to /tmp:', err);
                }
            }
        }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
}
exports.prisma = new client_1.PrismaClient({
    datasources: process.env.DATABASE_URL
        ? {
            db: {
                url: process.env.DATABASE_URL,
            },
        }
        : undefined,
});
//# sourceMappingURL=db.js.map