
import loginController from '../../controllers/login.controller';
import { check } from 'express-validator';


class LoginFunctions {

    constructor() {

    }

    public create() {
        return [check('email').isEmail().withMessage('Error En El Atributo Email | Valor'),
        check('password').trim().isLength({ min: 8 }).withMessage('Error En El Atributo Password | Valor'), loginController.create];
    }
}

const loginFunctions = new LoginFunctions();
export default loginFunctions;