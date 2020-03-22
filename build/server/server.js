"use strict";
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
/**
 * ARCHIVOS DE RUTAS
 */
const index_routes_1 = __importDefault(require("../routes/index.routes"));
const usuarios_routes_1 = __importDefault(require("../routes/usuarios.routes"));
const login_routes_1 = __importDefault(require("../routes/login.routes"));
class Server {
    /* INICIALIZACION DE FORMA AUTOMATICA */
    constructor() {
        /* PUERTO DE EXPRESS */
        this.port = process.env.NODE_ENV || 3000;
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    /* CONFIGURACION DEL APP (PUERTOS, MIDDLEWARE...) */
    config() {
        /* CONFIG. PUERTOS */
        this.app.set('port', this.port);
        /* PETICIONES DE FRONTEND AL BACKEND */
        this.app.use(cors_1.default());
        /* VISUALIZAR LAS PETICIONES ENTRANTES */
        this.app.use(morgan_1.default('dev'));
        /* CONVERSION DE DATOS ENTRANTES A JSON */
        this.app.use(express_1.default.json());
        /* CAPTURA DE DATOS POR X-WWWW-FORM-URLENCODED */
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        /* RUTA INDEX*/
        this.app.use('/index', index_routes_1.default);
        /* RUTA LOGIN - INICIAR SESION  */
        this.app.use('/login', login_routes_1.default);
        /* CONTROL DEL TOKEN */
        // this.app.use('/', usuariosController.token);
        /* RUTA USUARIOS */
        this.app.use('/usuario', usuarios_routes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`\nExpress server puerto ${this.port}: \x1b[32m%s\x1b[0m`, 'online\n');
        });
    }
}
const server = new Server();
exports.default = server;
