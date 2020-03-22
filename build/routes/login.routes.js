"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_function_1 = __importDefault(require("./functions/login.function"));
class LoginRoutes {
    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    /* CONFIGURA LAS RUTAS */
    config() {
        /* CREAR LOGIN */
        this.router.post('/', login_function_1.default.create());
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
