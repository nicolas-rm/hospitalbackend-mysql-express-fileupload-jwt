
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */

import { Router } from "express";

/**
 * FUNCTIONS: INTERMEDIO ENTRE EL 
 * CONTROLADOR Y LAS VALIDACIONES DE PETICIONES
 */
import verificaToken from '../middlewares/autenticacion.middleware';
import hospitalesFunctions from './functions/hospital.function';

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
        this.router.get('/', verificaToken, hospitalesFunctions.read());

        /* CREAR USUARIO */
        this.router.post('/', verificaToken, hospitalesFunctions.cread());

        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', verificaToken, hospitalesFunctions.update());

        /* ELIMINAR USUARIO */
        this.router.delete('/:id', verificaToken, hospitalesFunctions.delete());

    }
}

const hospitalRoutes = new HospitalRoutes();
export default hospitalRoutes.router;


