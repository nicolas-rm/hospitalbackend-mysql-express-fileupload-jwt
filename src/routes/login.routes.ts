import { Router } from "express";
import loginFunctions from './functions/login.function';
import loginController from '../controllers/login.controller';

class LoginRoutes {

    public router: Router = Router();


    /* INICIALIZA Y SE LLAMAN LOS METODOS */
    constructor() {
        this.config();
    }

    /* CONFIGURA LAS RUTAS */
    config(): void {


        /* CREAR LOGIN */
        this.router.post('/', loginFunctions.create());
    }
}

const loginRoutes = new LoginRoutes();
export default loginRoutes.router;
