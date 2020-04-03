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
const messages_messages_1 = __importDefault(require("./Messages/messages.messages"));
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const populate_constant_1 = __importDefault(require("./constants/populate.constant"));
const pagination_constant_1 = __importDefault(require("./constants//pagination.constant"));
const express_validator_1 = require("express-validator");
class HospitalesController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* CHECAR SI EXISTE UN ERROR DE LOS PARAMETROS REQUERIDOS */
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array()
                });
                return;
            }
            ;
            /* ALMACENAR EL VALOR PARA FACIL ACCESO */
            const body = req.body;
            /* USUARIO, GENERADO CON EL TOKEN */
            const usuarioToken = req.query.usuarioToken;
            /* OBJETO COMPLETO DE UN HOSPITAL */
            const hospital = {
                NOMBRE: body.nombre,
                IMG: body.img,
                ID_USUARIO: Number(usuarioToken.ID_USUARIO)
            };
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY DE INSERTAR / CREAR */
                const query = 'INSERT INTO HOSPITALES SET ?';
                /* INSERCION / CREACION DE UN NUEVO REGISTRO */
                /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
                hospital.ID_HOSPITAL = (yield connection.query(query, [hospital])).insertId;
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.create(['Hospital', 'HOSPITALES'], hospital, usuarioToken, res);
            }
            catch (err) {
                /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
                yield connection.rollback();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                errores_error_1.default.Query(err, res);
            }
            finally {
                /* CERRAR LA CONECCION CON LA BASE DE DATOS */
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* USUARIO, GENERADO CON EL TOKEN */
            const usuarioToken = req.query.usuarioToken;
            /* VARIABLE DE PAGINACION - OPCIONAL */
            const desde = Number(req.query.offset);
            /* VALIDACION DE LA QUERY A UTILIZAR */
            const query = (yield pagination_constant_1.default.pagination(desde, 'HOSPITALES'));
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
                let hospitales = yield connection.query(query, [desde]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* VISUALIZAR LOS DATOS FORANEOS */
                hospitales = yield (yield populate_constant_1.default.init(hospitales, 'USUARIOS', res));
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.read(['Hospital', 'HOSPITALES'], hospitales, usuarioToken, res);
            }
            catch (err) {
                /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
                yield connection.rollback();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                errores_error_1.default.Query(err, res);
            }
            finally {
                /* CERRAR LA CONECCION CON LA BASE DE DATOS */
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* CHECAR SI EXISTE UN ERROR DE LOS PARAMETROS REQUERIDOS */
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array()
                });
                return;
            }
            ;
            /* ALMACENAR EL VALOR PARA FACIL ACCESO */
            const body = req.body;
            /* ID: BUSQUEDA DEL DATO POR IDENTIFICADOR UNIDO */
            const id = Number(req.params.id);
            /* USUARIO, GENERADO CON EL TOKEN */
            const usuarioToken = req.query.usuarioToken;
            /* COLECCION: DEL DATO IDENTIFICADO */
            /*
             * PARAMETROS REQUERIDOS,
             * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
             * 2.- NOMBRE DE LA TABLA.
             * 3.- COLUMNA DEL ID A BUSCAR.
             * 4.- VARIABLE DE TIPO RESPONSE
             */
            const hospital = yield (yield findById_constant_1.default.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));
            /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
            if (!hospital) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Hospital Con El ID ${id} No Existe`,
                    hospital
                });
                return;
            }
            /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
            if (!req.body.nombre) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
            hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.nombre)
                hospital.NOMBRE = body.nombre;
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ACTUALIZAR / MODIFICAR */
                const query = 'UPDATE HOSPITALES SET ? WHERE ID_HOSPITAL = ?';
                /* ACTUALIZA LOS DATOS */
                yield connection.query(query, [hospital, id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.update(['Hospital', 'HOSPITALES'], hospital, usuarioToken, res);
            }
            catch (err) {
                /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
                yield connection.rollback();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                errores_error_1.default.Query(err, res);
            }
            finally {
                /* CERRAR LA CONECCION CON LA BASE DE DATOS */
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            /* CHECAR SI EXISTE UN ERROR DE LOS PARAMETROS REQUERIDOS */
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    errors: errors.array()
                });
                return;
            }
            ;
            /* ID: BUSQUEDA DEL DATO POR IDENTIFICADOR UNIDO */
            const id = Number(req.params.id);
            /* USUARIO, GENERADO CON EL TOKEN */
            const usuarioToken = req.query.usuarioToken;
            /* COLECCION: DEL DATO IDENTIFICADO */
            /*
             * PARAMETROS REQUERIDOS,
             * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
             * 2.- NOMBRE DE LA TABLA.
             * 3.- COLUMNA DEL ID A BUSCAR.
             * 4.- VARIABLE DE TIPO RESPONSE
             */
            const hospital = yield (yield findById_constant_1.default.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));
            /* VALIDAR SI EXISTE LA COLECCION */
            if (!hospital) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Hospital Con El ID ${id} No Existe`,
                    hospital
                });
                return;
            }
            /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
            hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ELIMINAR / QUITAR */
                const query = 'DELETE FROM HOSPITALES WHERE ID_HOSPITAL = ?';
                /* ELIMINA LOS DATOS */
                const user = yield connection.query(query, [id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.delete(['Hospital', 'HOSPITALES'], hospital, usuarioToken, res);
            }
            catch (err) {
                /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
                yield connection.rollback();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                errores_error_1.default.Query(err, res);
            }
            finally {
                /* CERRAR LA CONECCION CON LA BASE DE DATOS */
                (yield database_1.default).releaseConnection(connection);
            }
        });
    }
}
const hospitalesController = new HospitalesController();
exports.default = hospitalesController;
