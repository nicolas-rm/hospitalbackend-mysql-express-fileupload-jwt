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
const errores_error_1 = __importDefault(require("./errors/errores.error"));
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const express_validator_1 = require("express-validator");
const messages_messages_1 = __importDefault(require("./Messages/messages.messages"));
class HospitalesController {
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
            const usuarioToken = req.query.usuarioToken;
            const hospital = {
                NOMBRE: body.nombre,
                IMG: body.img,
                ID_USUARIO: usuarioToken.ID_USUARIO
            };
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'INSERT INTO HOSPITALES SET ?';
                hospital.ID_HOSPITAL = (yield connection.query(query, [hospital])).insertId;
                yield connection.commit();
                messages_messages_1.default.create('Hospital', hospital, usuarioToken, res);
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
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarioToken = req.query.usuarioToken;
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'SELECT * FROM HOSPITALES';
                const hospitales = yield connection.query(query);
                yield connection.commit();
                messages_messages_1.default.read('Hospitales', hospitales, usuarioToken, res);
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
            const usuarioToken = req.query.usuarioToken;
            const hospital = yield (yield findById_constant_1.default.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));
            if (!hospital) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Hospital Con El ID ${id} No Existe`,
                    hospital
                });
                return;
            }
            if (!req.body.nombre) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            hospital.ID_USUARIO = usuarioToken.ID_USUARIO;
            if (req.body.nombre)
                hospital.NOMBRE = body.nombre;
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'UPDATE HOSPITALES SET ? WHERE ID_HOSPITAL = ?';
                yield connection.query(query, [hospital, id]);
                yield connection.commit();
                messages_messages_1.default.update('Hospital', hospital, usuarioToken, res);
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
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array()
                });
                return;
            }
            ;
            const id = Number(req.params.id);
            const usuarioToken = req.query.usuarioToken;
            const hospital = yield (yield findById_constant_1.default.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));
            if (!hospital) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Hospital Con El ID ${id} No Existe`,
                    hospital
                });
                return;
            }
            hospital.ID_USUARIO = usuarioToken.ID_USUARIO;
            const connection = yield (yield database_1.default).getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'DELETE FROM HOSPITALES WHERE ID_HOSPITAL = ?';
                const user = yield connection.query(query, [id]);
                yield connection.commit();
                messages_messages_1.default.delete('Hospital', hospital, usuarioToken, res);
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
const hospitalesController = new HospitalesController();
exports.default = hospitalesController;
