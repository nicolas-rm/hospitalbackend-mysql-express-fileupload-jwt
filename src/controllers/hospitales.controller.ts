import pool from '../database/database';
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import messages from './Messages/messages.messages';
import findById from "./constants/findById.constant";
import populate from './constants/populate.constant';
import pagination from './constants//pagination.constant';
import { Result, ValidationError, validationResult } from 'express-validator';


class HospitalesController {

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

        /* USUARIO, GENERADO CON EL TOKEN */
        const usuarioToken: Usuarios = req.query.usuarioToken;

        /* OBJETO COMPLETO DE UN HOSPITAL */
        const hospital: Hospitales = {
            NOMBRE: body.nombre,
            IMG: body.img,
            ID_USUARIO: Number(usuarioToken.ID_USUARIO)
        };

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY DE INSERTAR / CREAR */
            const query = 'INSERT INTO HOSPITALES SET ?';

            /* INSERCION / CREACION DE UN NUEVO REGISTRO */
            /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
            hospital.ID_HOSPITAL = (await connection.query(query, [hospital])).insertId;

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.create(['Hospital', 'HOSPITALES'], hospital, res, usuarioToken);
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

    public async read(req: Request, res: Response): Promise<void> {

        /* USUARIO, GENERADO CON EL TOKEN */
        const usuarioToken: Usuarios = req.query.usuarioToken;

        /* VARIABLE DE PAGINACION - OPCIONAL */
        const desde = Number(req.query.offset);

        /* VALIDACION DE LA QUERY A UTILIZAR */
        const query = (await pagination.pagination(desde, 'HOSPITALES'));

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
            let hospitales: Hospitales = await connection.query(query, [desde]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* VISUALIZAR LOS DATOS FORANEOS */
            hospitales = await (await populate.init(hospitales, 'USUARIOS', res));

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.read(['Hospital', 'HOSPITALES'], hospitales, res, usuarioToken);
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

    public async update(req: Request, res: Response): Promise<void> {
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

        /* ID: BUSQUEDA DEL DATO POR IDENTIFICADOR UNIDO */
        const id = Number(req.params.id);

        /* USUARIO, GENERADO CON EL TOKEN */
        const usuarioToken: Usuarios = req.query.usuarioToken;

        /* COLECCION: DEL DATO IDENTIFICADO */
        /*
         * PARAMETROS REQUERIDOS,
         * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
         * 2.- NOMBRE DE LA TABLA.
         * 3.- COLUMNA DEL ID A BUSCAR.
         * 4.- VARIABLE DE TIPO RESPONSE
         */

        const hospital: Hospitales = await (await findById.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));

        /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Hospital Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }



        /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
        if (!req.body.nombre) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
        hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.nombre) hospital.NOMBRE = body.nombre;

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ACTUALIZAR / MODIFICAR */
            const query = 'UPDATE HOSPITALES SET ? WHERE ID_HOSPITAL = ?';


            /* ACTUALIZA LOS DATOS */
            await connection.query(query, [hospital, id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.update(['Hospital', 'HOSPITALES'], hospital, usuarioToken, res);
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

    public async delete(req: Request, res: Response): Promise<void> {
        /* CHECAR SI EXISTE UN ERROR DE LOS PARAMETROS REQUERIDOS */
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        /* ID: BUSQUEDA DEL DATO POR IDENTIFICADOR UNIDO */
        const id = Number(req.params.id);

        /* USUARIO, GENERADO CON EL TOKEN */
        const usuarioToken: Usuarios = req.query.usuarioToken

        /* COLECCION: DEL DATO IDENTIFICADO */
        /*
         * PARAMETROS REQUERIDOS,
         * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
         * 2.- NOMBRE DE LA TABLA.
         * 3.- COLUMNA DEL ID A BUSCAR.
         * 4.- VARIABLE DE TIPO RESPONSE
         */

        const hospital: Hospitales = await (await findById.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Hospital Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }

        /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
        hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);


        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {

            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ELIMINAR / QUITAR */
            const query = 'DELETE FROM HOSPITALES WHERE ID_HOSPITAL = ?';

            /* ELIMINA LOS DATOS */
            const user = await connection.query(query, [id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.delete(['Hospital', 'HOSPITALES'], hospital, usuarioToken, res);
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

}


const hospitalesController = new HospitalesController();
export default hospitalesController;