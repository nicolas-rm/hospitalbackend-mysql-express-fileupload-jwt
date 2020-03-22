
/**
 * ARCHIVOS DE CONFIGURACIONES, MIDDLEWARE
 */

import { Router } from "express";

/**
 * FUNCTIONS: INTERMEDIO ENTRE EL 
 * CONTROLADOR Y LAS VALIDACIONES DE PETICIONES
 */
import usuarioFunctions from './functions/usuario.function';
import verificaToken from '../middlewares/autenticacion';

class UsuariosRoutes {
    /* ENROUTADOR */
    public router: Router = Router();


    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.config();
    }

    /* CONFIGURA LAS RUTAS */
    config(): void {

        /* MOSTRAR USUARIOS */
        this.router.get('/', usuarioFunctions.read());

        /* CREAR USUARIO */
        this.router.post('/', verificaToken, usuarioFunctions.create());

        /* ACTUALIZAR USUARIO */
        this.router.put('/:id', verificaToken, usuarioFunctions.update());

        /* ELIMINAR USUARIO */
        this.router.delete('/:id', verificaToken, usuarioFunctions.delete());

    }
}

const usuariosRoutes = new UsuariosRoutes();
export default usuariosRoutes.router;


