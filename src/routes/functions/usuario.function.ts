import { check } from 'express-validator';
import usuariosController from '../../controllers/usuarios.controller';


class UsuariosFunctions {
    private roles = ['ADMIN_ROLE', 'USER_ROLE'];
    constructor() {

    }

    public create() {
        return [check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        check('email').isEmail().withMessage('Error En El Atributo Email | Valor'),
        check('password').trim().isLength({ min: 8 }).withMessage('Error En El Atributo Password | Valor'),
        check('img').trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
        check('role').trim().isLength({ min: 3 }).isIn(this.roles).withMessage('Error En El Atributo Role | Valor'), 
        usuariosController.create];
    }

    public read() {
        return usuariosController.read;
    }

    public update() {
        return [check('nombre').optional().trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        check('email').optional().isEmail().withMessage('Error En El Atributo Email | Valor'),
        check('role').optional().trim().isLength({ min: 3 }).isIn(this.roles).withMessage('Error En El Atributo Role | Valor'),usuariosController.update];
    }

    public delete() {
        return usuariosController.delete;
    }

    


}

const usuariosFunctions = new UsuariosFunctions();
export default usuariosFunctions;