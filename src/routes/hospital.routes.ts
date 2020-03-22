
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */

import { Router } from "express";

/**
 * FUNCTIONS: INTERMEDIO ENTRE EL 
 * CONTROLADOR Y LAS VALIDACIONES DE PETICIONES
 */
import usuarioFunctions from './functions/usuario.function';
import verificaToken from '../middlewares/autenticacion.middleware';
import hospitalesController from '../controllers/hospitales.controller';

class HospitalRoutes {
    /* ENROUTADOR */
    public router: Router = Router();


    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.config();
    }

    /* CONFIGURA LAS RUTAS */
    config(): void {

        /* MOSTRAR USUARIOS */
        this.router.get('/', hospitalesController.read);

        /* CREAR USUARIO */
        this.router.post('/', hospitalesController.create);

        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', hospitalesController.update);

        /* ELIMINAR USUARIO */
        this.router.delete('/:id', hospitalesController.delete);

    }
}

const hospitalRoutes = new HospitalRoutes();
export default hospitalRoutes.router;


