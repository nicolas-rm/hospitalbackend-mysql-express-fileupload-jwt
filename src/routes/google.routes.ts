import { Router } from "express";
import busquedaController from "../controllers/busqueda.controller";




class GoogleRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }

    config() {
        this.router.get('/:busqueda', busquedaController.find);
        this.router.get('/:tabla/:busqueda', busquedaController.search);
    }
}

const googleRoutes = new GoogleRoutes();
export default googleRoutes.router;