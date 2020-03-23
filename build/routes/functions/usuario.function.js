"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const usuarios_controller_1 = __importDefault(require("../../controllers/usuarios.controller"));
class UsuariosFunctions {
    constructor() {
        this.roles = ['ADMIN_ROLE', 'USER_ROLE'];
    }
    create() {
        return [express_validator_1.check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            express_validator_1.check('email').isEmail().withMessage('Error En El Atributo Email | Valor'),
            express_validator_1.check('password').trim().isLength({ min: 8 }).withMessage('Error En El Atributo Password | Valor'),
            express_validator_1.check('img').trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
            express_validator_1.check('role').trim().isLength({ min: 3 }).isIn(this.roles).withMessage('Error En El Atributo Role | Valor'),
            usuarios_controller_1.default.create];
    }
    read() {
        return usuarios_controller_1.default.read;
    }
    update() {
        return [express_validator_1.check('nombre').optional().trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            express_validator_1.check('email').optional().isEmail().withMessage('Error En El Atributo Email | Valor'),
            express_validator_1.check('role').optional().trim().isLength({ min: 3 }).isIn(this.roles).withMessage('Error En El Atributo Role | Valor'), usuarios_controller_1.default.update];
    }
    delete() {
        return usuarios_controller_1.default.delete;
    }
}
const usuariosFunctions = new UsuariosFunctions();
exports.default = usuariosFunctions;
