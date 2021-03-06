import { Router } from "express";
import loginFunctions from './functions/login.function';

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
        this.router.post('/google', loginFunctions.google());
    }
}

const loginRoutes = new LoginRoutes();
export default loginRoutes.router;
