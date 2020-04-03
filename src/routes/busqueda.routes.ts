import { Router } from "express";
import busquedaController from "../controllers/busqueda.controller";




class BusquedaRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }

    config() {
        this.router.get('/:busqueda', busquedaController.find);
        this.router.get('/:tabla/:busqueda', busquedaController.search);
    }
}

const busquedaRoutes = new BusquedaRoutes();
export default busquedaRoutes.router;