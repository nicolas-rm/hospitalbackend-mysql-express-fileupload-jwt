import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import findById from "./constants/findById.constant";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SEED from '../configurations/config';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import CLIENT_ID from '../database/keys/google';
import pool from '../database/database';
import messages from './Messages/messages.messages';
import queryError from './errors/errores.error';
class LoginController {
    private client = new OAuth2Client(CLIENT_ID);

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

            if (usuario.GOOGLE) {
                res.status(400).json({
                    OK: false,
                    PUT: `Debe De Usar Su Autenticacion Por Google`,
                    usuario
                });
                return;
            }
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
        const TOKEN = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); //4 HORAS

        res.status(200).json({
            OK: true,
            PUT: `Las Credenciales Son Correctas.`,
            USUARIO: usuario,
            ID: usuario.ID_USUARIO,
            TOKEN
        });

    }

    public async google(req: Request, res: Response): Promise<any> {
        const token = req.body.token;
        const payload: Payload = await (await loginController.veryToken(token, res));

        console.log(payload);
        if (Object.keys(payload).length < 1) {
            res.status(400).json({
                OK: false,
                PUT: `Payload Generado No Cumple Con Los Requisitos Para Crear Un Nuevo Usuario`
            });
            return;
        }

        // res.status(200).json({
        //     OK: true,
        //     // PUT: `Payload Generado No Cumple Con Los Requisitos Para Crear Un Nuevo Usuario`
        // });
        // return;
        const usuario: Usuarios = await (await findById.FindById(payload.email, 'USUARIOS', 'EMAIL', res));



        /* VALIDAR SI EXISTE LA COLECCION */
        if (usuario) {
            console.log('SI ENTRO');
            if (!usuario.GOOGLE) {
                res.status(400).json({
                    OK: false,
                    PUT: `Debe De Usar Su Autenticacion Normal`
                });
                return;
            }

            if (usuario.GOOGLE) {
                const TOKEN = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); //4 HORAS

                res.status(200).json({
                    OK: true,
                    PUT: `Las Credenciales Son Correctas.`,
                    USUARIO: usuario,
                    ID: usuario.ID_USUARIO,
                    TOKEN
                });
                return;
            }
        }

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!usuario) {

            const usuario: Usuarios = {
                NOMBRE: payload.nombre,
                EMAIL: payload.email,
                PASSWORD: bcrypt.hashSync(':)', 10),
                IMG: payload.img,
                ROLE: 'USER_ROLE',
                GOOGLE: true
            };

            /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
            const connection = await (await pool).getConnection();

            try {
                /* INICIO DE TRANSACCIONES SEGURAS */
                await connection.beginTransaction();

                /* QUERY DE INSERTAR / CREAR */
                const query = 'INSERT INTO USUARIOS SET ?';

                /* INSERCION / CREACION DE UN NUEVO REGISTRO */
                /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
                usuario.ID_USUARIO = (await connection.query(query, [usuario])).insertId;

                /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
                await connection.commit();

                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                // messages.create(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
                const TOKEN = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); //4 HORAS

                res.status(200).json({
                    OK: true,
                    PUT: `Las Credenciales Son Correctas.`,
                    USUARIO: usuario,
                    ID: usuario.ID_USUARIO,
                    TOKEN
                });
            } catch (err) {
                /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
                await connection.rollback();

                /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
                queryError.Query(err, res);
            } finally {
                /* CERRAR LA CONECCION CON LA BASE DE DATOS */
                (await pool).releaseConnection(connection);
            }
        }

        // res.status(200).json({
        //     OK: true,
        //     // PUT: `Payload Generado No Cumple Con Los Requisitos Para Crear Un Nuevo Usuario`
        //     usuario
        // });
        // return;
    }

    private async veryToken(token: any, res: Response): Promise<any> {
        var pay: any = {};
        try {
            const ticket = await loginController.client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload: any = ticket.getPayload();
            pay = payload;

            pay.nombre = payload.name;
            pay.email = payload.email;
            pay.img = payload.picture;
            pay.google = true;

            // pay.nombre = 'Nicolas RM';
            // pay.email = 'nicolas.rm540@gmail.com';
            // pay.img = 'NO-IMAGE';
            // pay.google = true;

        } catch (error) {
            const err = error;
            // loginController.client.getTokenInfo
            res.status(400).json({
                Error: 'Error Al Comprobar El Google Token'
            });
            return;
        }

        return pay;


        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];



    }
}



const loginController = new LoginController();
export default loginController;