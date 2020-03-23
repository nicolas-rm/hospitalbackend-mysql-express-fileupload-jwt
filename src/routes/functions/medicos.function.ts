import { check } from 'express-validator';
import medicosController from '../../controllers/medicos.controller';
class MedicosFunctions {
    constructor() {

    }
    public create() {
        return [check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        check('img').trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
        check('id_hospital').isInt().trim().isLength({ min: 1 }).withMessage('Error En El Atributo Hospital | Valor'),
        medicosController.create];
    }
    public read() {
        return medicosController.read;
    }
    public update() {
        return [check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        check('id_hospital').isInt().trim().isLength({ min: 1 }).withMessage('Error En El Atributo Hospital | Valor'),
        medicosController.update];
    }
    public delete() {
        return medicosController.delete;
    }
}

const medicosFunctions = new MedicosFunctions();
export default medicosFunctions;