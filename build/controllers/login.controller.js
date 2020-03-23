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
const express_validator_1 = require("express-validator");
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../configurations/config"));
class LoginController {
    constructor() {
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array()
                });
                return;
            }
            ;
            const body = req.body;
            const email = body.email;
            const password = body.password;
            const usuario = yield (yield findById_constant_1.default.FindById(email, 'USUARIOS', 'EMAIL', res));
            if (!usuario) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Correo ${email} No Existe`,
                    usuario
                });
                return;
            }
            if (!bcryptjs_1.default.compareSync(password, usuario.PASSWORD)) {
                res.status(400).json({
                    OK: false,
                    PUT: `Las Contraseñas No Coinciden`,
                    usuario
                });
                return;
            }
            /* CREACION JWT */
            /**
             * ESTRUCTURA DE UN JWT
             *
             * 1.- VALORES A ENCRIPTAR: EN ESTE CASO (USUARIO)
             * 2.- UNA SEMILLA O UNA PALABRA A CONJUGAR
             * 3.- TIEMPO DE EXPIRACION
             */
            const token = jsonwebtoken_1.default.sign({ usuario }, config_1.default, { expiresIn: 14400 }); //4 HORAS
            res.status(200).json({
                OK: true,
                PUT: `Credenciales Correctas.`,
                USUARIO: usuario,
                ID: usuario.ID_USUARIO,
                Token: token
            });
        });
    }
}
const loginController = new LoginController();
exports.default = loginController;
