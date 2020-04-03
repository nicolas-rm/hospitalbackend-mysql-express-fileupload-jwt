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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../database/database"));
const errores_error_1 = __importDefault(require("./errors/errores.error"));
const messages_messages_1 = __importDefault(require("./Messages/messages.messages"));
const findById_constant_1 = __importDefault(require("./constants/findById.constant"));
const pagination_constant_1 = __importDefault(require("./constants//pagination.constant"));
const express_validator_1 = require("express-validator");
class UsuariosController {
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
            const usuario = {
                NOMBRE: body.nombre,
                EMAIL: body.email,
                PASSWORD: bcryptjs_1.default.hashSync(body.password, 10),
                IMG: body.img,
                ROLE: body.role
            };
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY DE INSERTAR / CREAR */
                const query = 'INSERT INTO USUARIOS SET ?';
                /* INSERCION / CREACION DE UN NUEVO REGISTRO */
                /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
                usuario.ID_USUARIO = (yield connection.query(query, [usuario])).insertId;
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.create(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
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
            const query = (yield pagination_constant_1.default.pagination(desde, 'USUARIOS'));
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
                const usuarios = yield connection.query(query, [desde]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.read(['Usuario', 'Usuarios'], usuarios, usuarioToken, res);
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
            const usuario = yield (yield findById_constant_1.default.FindById(id, 'USUARIOS', 'ID_USUARIO', res));
            /* VALIDAR SI EXISTE LA COLECCION */
            if (!usuario) {
                res.status(400).json({
                    OK: false,
                    PUT: `El Usuario Con El ID ${id} No Existe`,
                    usuario
                });
                return;
            }
            /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
            if (!req.body.nombre && !req.body.email && !req.body.role) {
                res.status(302).json({
                    OK: false,
                    PUT: 'NO SE REALIZO NINGUN CAMBIO'
                });
                return;
            }
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.nombre)
                usuario.NOMBRE = body.nombre;
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.email)
                usuario.EMAIL = body.email;
            /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
            if (req.body.role)
                usuario.ROLE = body.role;
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ACTUALIZAR / MODIFICAR */
                const query = 'UPDATE USUARIOS SET ? WHERE ID_USUARIO = ?';
                /* ACTUALIZA LOS DATOS */
                yield connection.query(query, [usuario, id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.update(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
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
            const usuario = yield (yield findById_constant_1.default.FindById(id, 'USUARIOS', 'ID_USUARIO', res));
            /* VALIDAR SI EXISTE LA COLECCION */
            if (!usuario) {
                res.status(400).json({
                    OK: false,
                    DELETE: `El Usuario Con El ID ${id} No Existe`,
                    usuario
                });
                return;
            }
            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = yield (yield database_1.default).getConnection();
            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                yield connection.beginTransaction();
                /* QUERY - ELIMINAR / QUITAR */
                const query = 'DELETE FROM USUARIOS WHERE ID_USUARIO = ?';
                /* ELIMINA LOS DATOS */
                yield connection.query(query, [id]);
                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                yield connection.commit();
                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                messages_messages_1.default.delete(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
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
const usuariosController = new UsuariosController();
exports.default = usuariosController;
