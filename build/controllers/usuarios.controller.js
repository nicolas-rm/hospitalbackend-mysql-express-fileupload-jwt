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
const database_1 = __importDefault(require("../database/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const errores_error_1 = __importDefault(require("./errors/errores.error"));
// import SEED from '../configurations/config';
// import jwt from 'jsonwebtoken';
class UsuariosController {
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'SELECT ID_USUARIO, NOMBRE, EMAIL, PASSWORD, IMG, ROLE FROM USUARIOS';
                const usuarios = yield connection.query(query);
                yield connection.commit();
                res.status(200).json({
                    OK: true,
                    GET: 'Carga De Usuarios Completa',
                    USUARIOS: usuarios,
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                (yield database_1.default).releaseConnection(connection);
            }
        });
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
            const usuario = {
                NOMBRE: body.nombre,
                EMAIL: body.email,
                PASSWORD: bcryptjs_1.default.hashSync(body.password, 10),
                IMG: body.img,
                ROLE: body.role
            };
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'INSERT INTO USUARIOS SET ?';
                usuario.ID_USUARIO = (yield connection.query(query, [usuario])).insertId;
                yield connection.commit();
                res.status(201).json({
                    OK: true,
                    POST: 'Usuario Creado Correctamente',
                    USUARIOS: usuario,
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
    update(req, res) {
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
            const id = Number(req.params.id);
            const usuario = yield (yield findById_constant_1.default.FindById(id, 'USUARIOS', 'ID_USUARIO', res));
            if (!usuario) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Usuario Con El ID ${id} No Existe`,
                    usuario
                });
                return;
            }
            if (req.body.nombre)
                usuario.NOMBRE = body.nombre;
            if (req.body.email)
                usuario.EMAIL = body.email;
            if (req.body.role)
                usuario.ROLE = body.role;
            if (!req.body.nombre && !req.body.email && !req.body.role) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'UPDATE USUARIOS SET ? WHERE ID_USUARIO = ?';
                const user = yield connection.query(query, [usuario, id]);
                yield connection.commit();
                res.status(200).json({
                    OK: true,
                    PUT: 'Usuario Actualizado Correctamente',
                    usuario,
                    user,
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const usuario = yield (yield findById_constant_1.default.FindById(id, 'USUARIOS', 'ID_USUARIO', res));
            if (!usuario) {
                res.status(400).json({
                    OK: false,
                    DELETE: `El Usuario Con El ID ${id} No Existe`,
                    usuario
                });
                return;
            }
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'DELETE FROM USUARIOS WHERE ID_USUARIO = ?';
                const user = yield connection.query(query, [id]);
                yield connection.commit();
                res.status(200).json({
                    OK: true,
                    DELETE: 'Usuario Eliminado Correctamente',
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
}
const usuariosController = new UsuariosController();
exports.default = usuariosController;
