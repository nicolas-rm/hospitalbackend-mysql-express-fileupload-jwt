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
const autenticacion_middleware_1 = __importDefault(require("../middlewares/autenticacion.middleware"));
const hospital_function_1 = __importDefault(require("./functions/hospital.function"));
class HospitalRoutes {
    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        /* ENROUTADOR */
        this.router = express_1.Router();
        this.config();
    }
    /* CONFIGURA LAS RUTAS */
    config() {
        /* MOSTRAR USUARIOS */
        this.router.get('/', autenticacion_middleware_1.default, hospital_function_1.default.read());
        /* CREAR USUARIO */
        this.router.post('/', autenticacion_middleware_1.default, hospital_function_1.default.cread());
        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', autenticacion_middleware_1.default, hospital_function_1.default.update());
        /* ELIMINAR USUARIO */
        this.router.delete('/:id', autenticacion_middleware_1.default, hospital_function_1.default.delete());
    }
}
const hospitalRoutes = new HospitalRoutes();
exports.default = hospitalRoutes.router;
