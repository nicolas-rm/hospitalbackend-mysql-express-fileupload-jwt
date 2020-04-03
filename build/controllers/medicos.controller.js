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
const populate_constant_1 = __importDefault(require("./constants/populate.constant"));
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const pagination_constant_1 = __importDefault(require("./constants//pagination.constant"));
const express_validator_1 = require("express-validator");
class MedicosController {
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
            /* OBJETO COMPLETO DE UN MEDICO */
            const medico = {
                NOMBRE: body.nombre,
                IMG: body.img,
                ID_USUARIO: usuarioToken.ID_USUARIO,
                ID_HOSPITAL: Number(body.id_hospital)
            };
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY DE INSERTAR / CREAR */
                const query = 'INSERT INTO MEDICOS SET ?';
                /* INSERCION / CREACION DE UN NUEVO REGISTRO */
                /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
                medico.ID_MEDICO = (yield connection.query(query, [medico])).insertId;
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.create(['Medico', 'Medicos'], medico, usuarioToken, res);
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
            const query = (yield pagination_constant_1.default.pagination(desde, 'MEDICOS'));
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default.getConnection());
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
                let medicos = yield connection.query(query, [desde]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* VISUALIZAR LOS DATOS FORANEOS */
                medicos = yield (yield populate_constant_1.default.init(medicos, 'HOSPITALES', res));
                medicos = yield (yield populate_constant_1.default.init(medicos, 'USUARIOS', res));
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.read(['Medico', 'Medicos'], medicos, usuarioToken, res);
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
            const medico = yield (yield findById_constant_1.default.FindById(id, 'MEDICOS', 'ID_MEDICO', res));
            /* VALIDAR SI EXISTE LA COLECCION */
            if (!medico) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Medico Con El ID ${id} No Existe`,
                    medico
                });
                return;
            }
            /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
            if (!req.body.nombre && !req.body.id_hospital) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
            medico.ID_USUARIO = usuarioToken.ID_USUARIO;
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.nombre)
                medico.NOMBRE = body.nombre;
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.id_hospital)
                medico.ID_HOSPITAL = Number(body.id_hospital);
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default.getConnection());
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ACTUALIZAR / MODIFICAR */
                const query = 'UPDATE MEDICOS SET ? WHERE ID_MEDICO = ?';
                /* ACTUALIZA LOS DATOS */
                yield connection.query(query, [medico, id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.update(['Medico', 'Medicos'], medico, usuarioToken, res);
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
            const medico = yield (yield findById_constant_1.default.FindById(id, 'MEDICOS', 'ID_MEDICO', res));
            /* VALIDAR SI EXISTE LA COLECCION */
            if (!medico) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Medico Con El ID ${id} No Existe`,
                    medico
                });
                return;
            }
            /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
            medico.ID_USUARIO = Number(usuarioToken.ID_USUARIO);
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield database_1.default.getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ELIMINAR / QUITAR */
                const query = 'DELETE FROM MEDICOS WHERE ID_MEDICO = ?';
                /* ELIMINA LOS DATOS */
                yield connection.query(query, [id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.delete(['Medico', 'Medicos'], medico, usuarioToken, res);
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
const medicosController = new MedicosController();
exports.default = medicosController;
