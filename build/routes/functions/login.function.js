"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_controller_1 = __importDefault(require("../../controllers/login.controller"));
const express_validator_1 = require("express-validator");
class LoginFunctions {
    constructor() {
    }
    create() {
        return [express_validator_1.check('email').isEmail().withMessage('Error En El Atributo Email | Valor'),
            express_validator_1.check('password').trim().isLength({ min: 8 }).withMessage('Error En El Atributo Password | Valor'), login_controller_1.default.create];
    }
}
const loginFunctions = new LoginFunctions();
exports.default = loginFunctions;
