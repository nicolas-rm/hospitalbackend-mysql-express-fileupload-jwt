
/* 
    * IMPORTACION DE LIBRERIAS 
    * O MUDULOS NECESARIOS
    * PARA LAS CONFIGURACIONES
*/

import { Router } from 'express';
import { loadsController } from '../controllers/loads.constroller';




class LoadsRoutes {

    /* ENROUTADOR */
    public router: Router = Router();

    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.config();
        
    }

    /* CONFIGURA LAS RUTAS */
    config(): void {
        // this.router.post('/', uploadsController.upload);
        // this.router.get('/', gamesController.read);
        this.router.get('/:tipo/:img', loadsController.readOne);
        // this.router.put('/:title', uploadsController.upload);
        // this.router.delete('/:id', gamesController.delete);
    }
    
}


/* 
    * EJECUTA CLASE   
    * Y
    * DEVUELVE UN OBJETO
*/

const loadsRoutes = new LoadsRoutes();

/* 
    * EXPORTA SOLAMENTE EL ROUTER, 
    * PARA UTILIZAR LAS RUTAS EN 
    * OTRO LUGAR Y NO TODO EL OBJETO
*/

export default loadsRoutes.router;