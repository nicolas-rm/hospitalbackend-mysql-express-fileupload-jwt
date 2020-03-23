
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */

import { Router } from "express";

/**
 * FUNCTIONS: INTERMEDIO ENTRE EL 
 * CONTROLADOR Y LAS VALIDACIONES DE PETICIONES
 */
import verificaToken from '../middlewares/autenticacion.middleware';
import medicosFunctions from './functions/medicos.function';

class MedicoRoutes {
    /* ENROUTADOR */
    public router: Router = Router();


    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.config();
    }

    /* CONFIGURA LAS RUTAS */
    config(): void {

        /* MOSTRAR USUARIOS */
        this.router.get('/', verificaToken, medicosFunctions.read());

        /* CREAR USUARIO */
        this.router.post('/', verificaToken, medicosFunctions.create());

        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', verificaToken, medicosFunctions.update());

        /* ELIMINAR USUARIO */
        this.router.delete('/:id', verificaToken, medicosFunctions.delete());

    }
}

const medicoRoutes = new MedicoRoutes();
export default medicoRoutes.router;


