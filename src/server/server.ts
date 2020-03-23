
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
import usuarioRoutes from '../routes/usuario.routes';
import loginRoutes from '../routes/login.routes';
import hospitaleRoutes from '../routes/hospital.routes';
import medicoRoutes from '../routes/medico.routes';


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
        this.app.use(cors({
            origin: "*",
            methods: "GET,PUT,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204
        }));

        /* VISUALIZAR LAS PETICIONES ENTRANTES */
        this.app.use(morgan('dev'));

        /* CONVERSION DE DATOS ENTRANTES A JSON */
        this.app.use(express.json());

        /* CAPTURA DE DATOS POR X-WWWW-FORM-URLENCODED */
        this.app.use(express.urlencoded({ extended: false }));
    }


    routes() {

        /* RUTA INDEX*/
        // this.app.use('/index', indexRoutes);
        
        /* RUTA MEDICO */
        this.app.use('/medico', medicoRoutes);

        /* RUTA HOSPITALES */
        this.app.use('/hospital', hospitaleRoutes);
        
        /* RUTA USUARIOS */
        this.app.use('/usuario', usuarioRoutes);

        /* RUTA LOGIN - INICIAR SESION  */
        this.app.use('/login', loginRoutes);

    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`\nExpress server puerto ${this.port}: \x1b[32m%s\x1b[0m`, 'online\n');
        });
    }
}

const server = new Server();
export default server;

