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
const populate_constant_1 = __importDefault(require("./constants/populate.constant"));
const pagination_constant_1 = __importDefault(require("./constants//pagination.constant"));
class MedicosController {
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
            const medico = {
                NOMBRE: body.nombre,
                IMG: body.img,
                ID_USUARIO: usuarioToken.ID_USUARIO,
                ID_HOSPITAL: Number(body.id_hospital)
            };
            const connection = yield database_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'INSERT INTO MEDICOS SET ?';
                medico.ID_MEDICO = (yield connection.query(query, [medico])).insertId;
                yield connection.commit();
                res.status(201).json({
                    OK: true,
                    POST: 'Medico Creado Correctamente',
                    Medico: medico,
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                database_1.default.releaseConnection(connection);
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarioToken = req.query.usuarioToken;
            const desde = Number(req.query.offset);
            const query = pagination_constant_1.default.pagination(desde, 'MEDICOS');
            const connection = yield database_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                let medicos = yield connection.query(query, [desde]);
                yield connection.commit();
                medicos = yield (yield populate_constant_1.default.init(medicos, 'HOSPITALES', res));
                medicos = yield (yield populate_constant_1.default.init(medicos, 'USUARIOS', res));
                messages_messages_1.default.read('Medicos', medicos, usuarioToken, res);
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                database_1.default.releaseConnection(connection);
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
            const medico = yield (yield findById_constant_1.default.FindById(id, 'MEDICOS', 'ID_MEDICO', res));
            if (!medico) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Medico Con El ID ${id} No Existe`,
                    medico
                });
                return;
            }
            if (!req.body.nombre && req.body.id_hospital) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            medico.ID_USUARIO = usuarioToken.ID_USUARIO;
            if (req.body.nombre)
                medico.NOMBRE = body.nombre;
            if (req.body.id_hospital)
                medico.ID_HOSPITAL = Number(body.id_hospital);
            const connection = yield database_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'UPDATE MEDICOS SET ? WHERE ID_MEDICO = ?';
                yield connection.query(query, [medico, id]);
                yield connection.commit();
                res.status(200).json({
                    OK: true,
                    PUT: 'Medico Actualizado Correctamente',
                    medico,
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                database_1.default.releaseConnection(connection);
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
            const body = req.body;
            const id = Number(req.params.id);
            const usuarioToken = req.query.usuarioToken;
            const hospital = yield (yield findById_constant_1.default.FindById(id, 'MEDICOS', 'ID_MEDICO', res));
            if (!hospital) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Medico Con El ID ${id} No Existe`,
                    hospital
                });
                return;
            }
            hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);
            const connection = yield database_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                const query = 'DELETE FROM MEDICOS WHERE ID_MEDICO = ?';
                const user = yield connection.query(query, [id]);
                yield connection.commit();
                res.status(200).json({
                    OK: true,
                    DELETE: 'Medico Eliminado Correctamente',
                    usuarioToken: req.query.usuarioToken
                });
            }
            catch (err) {
                yield connection.rollback();
                errores_error_1.default.Query(err, res);
            }
            finally {
                database_1.default.releaseConnection(connection);
            }
        });
    }
}
const medicosController = new MedicosController();
exports.default = medicosController;
