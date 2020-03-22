"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../configurations/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verificaToken = function (req, res, next) {
    /* PODER RECIBIR PARAMETROS OPCIONALES */
    const token = req.query.token;
    const json = jsonwebtoken_1.default.verify(token, config_1.default, (err, decoded) => {
        if (err) {
            res.status(401).json({
                TOKEN: 'TOKEN INVALIDO',
                err
            });
            return;
        }
        req.query.usuarioToken = decoded.usuario;
        next();
        // res.status(200).json({
        //     TOKEN: 'TOKEN VALIDO',
        //     Decoded: decoded
        // });
    });
};
exports.default = verificaToken;
