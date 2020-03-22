"use strict";
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * FUNCTIONS: INTERMEDIO ENTRE EL
 * CONTROLADOR Y LAS VALIDACIONES DE PETICIONES
 */
const usuario_function_1 = __importDefault(require("./functions/usuario.function"));
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
class UsuariosRoutes {
    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        /* ENROUTADOR */
        this.router = express_1.Router();
        this.config();
    }
    /* CONFIGURA LAS RUTAS */
    config() {
        /* MOSTRAR USUARIOS */
        this.router.get('/', usuario_function_1.default.read());
        /* CREAR USUARIO */
        this.router.post('/', autenticacion_1.default, usuario_function_1.default.create());
        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', autenticacion_1.default, usuario_function_1.default.update());
        /* ELIMINAR USUARIO */
        this.router.delete('/:id', autenticacion_1.default, usuario_function_1.default.delete());
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
