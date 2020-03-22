
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */

import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

/**
 * ARCHIVOS DE RUTAS
 */
import indexRoutes from '../routes/index.routes';
import usuariosRoutes from '../routes/usuarios.routes';
import loginRoutes from '../routes/login.routes';
import usuariosController from '../controllers/usuarios.controller';

class Server {

    /* VARIABLE, CONFIGURACION DE LA APLICACION */
    public app: Application;

    /* PUERTO DE EXPRESS */
    public port = process.env.NODE_ENV || 3000;

    /* INICIALIZACION DE FORMA AUTOMATICA */
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    /* CONFIGURACION DEL APP (PUERTOS, MIDDLEWARE...) */
    config() {
        /* CONFIG. PUERTOS */
        this.app.set('port', this.port);

        /* PETICIONES DE FRONTEND AL BACKEND */
        this.app.use(cors());

        /* VISUALIZAR LAS PETICIONES ENTRANTES */
        this.app.use(morgan('dev'));

        /* CONVERSION DE DATOS ENTRANTES A JSON */
        this.app.use(express.json());

        /* CAPTURA DE DATOS POR X-WWWW-FORM-URLENCODED */
        this.app.use(express.urlencoded({ extended: false }));
    }


    routes() {
        
        /* RUTA INDEX*/
        this.app.use('/index', indexRoutes);
        
        
        /* RUTA LOGIN - INICIAR SESION  */
        this.app.use('/login', loginRoutes);
        
        /* CONTROL DEL TOKEN */
        // this.app.use('/', usuariosController.token);
        
        /* RUTA USUARIOS */
        this.app.use('/usuario', usuariosRoutes);
        
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`\nExpress server puerto ${this.port}: \x1b[32m%s\x1b[0m`, 'online\n');
        });
    }
}

const server = new Server();
export default server;

