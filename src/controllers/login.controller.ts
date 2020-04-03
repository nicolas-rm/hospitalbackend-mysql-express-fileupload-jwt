import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import findById from "./constants/findById.constant";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SEED from '../configurations/config';
class LoginController {

    public async create(req: Request, res: Response): Promise<void> {
        /* CHECAR SI EXISTE UN ERROR DE LOS PARAMETROS REQUERIDOS */
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        /* ALMACENAR EL VALOR PARA FACIL ACCESO */
        const body = req.body;
        const email = body.email;
        const password = body.password;

        /* USUARIO, GENERADO CON EL TOKEN */
        const usuario: Usuarios = await (await findById.FindById(email, 'USUARIOS', 'EMAIL', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!usuario) {
            res.status(400).json({
                OK: false,
                PUT: `El Correo ${email} No Existe`,
                usuario
            });
            return;
        }

        /* COMPARA LOS TOKEN - SI SON IGUALES */
        if (!bcrypt.compareSync(password, usuario.PASSWORD)) {
            res.status(400).json({
                OK: false,
                PUT: `Las Credenciales No Coinciden.`,
                usuario
            });
            return;
        }

        /* CREACION JWT */
        /**
         * ESTRUCTURA DE UN JWT
         * 
         * 1.- VALORES A ENCRIPTAR: EN ESTE CASO (USUARIO)
         * 2.- UNA SEMILLA O UNA PALABRA A CONJUGAR
         * 3.- TIEMPO DE EXPIRACION
         */
        const token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); //4 HORAS

        res.status(200).json({
            OK: true,
            PUT: `Las Credenciales Son Correctas.`,
            USUARIO: usuario,
            ID: usuario.ID_USUARIO,
            Token: token
        });

    }
}


const loginController = new LoginController();
export default loginController;