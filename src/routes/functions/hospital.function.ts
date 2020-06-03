import { check } from "express-validator";
import hospitalesController from '../../controllers/hospitales.controller';


class HospitalesFunctions {


    public cread() {
        return [check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        check('img').optional().trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
        hospitalesController.create];
    }

    public read() {
        return hospitalesController.read;
    }

    public readOne() {
        return [hospitalesController.readOne];
    }

    public update() {
        return [check(['nombre']).optional().trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
        hospitalesController.update];
    }

    public delete() {
        return hospitalesController.delete;
    }
}

const hospitalesFunctions = new HospitalesFunctions();
export default hospitalesFunctions;