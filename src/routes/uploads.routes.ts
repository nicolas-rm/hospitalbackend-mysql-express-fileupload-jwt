import { Router } from "express";
import uploadsController from '../controllers/uploads.controller';





class UploadsRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }

    config() {
        this.router.put('/:tipo/:id', uploadsController.upload);
        // this.router.get('/:tabla/:busqueda', busquedaController.search);
    }
}

const uploadsRoutes = new UploadsRoutes();
export default uploadsRoutes.router;