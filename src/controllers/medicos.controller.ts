import pool from '../database/database';
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import messages from './Messages/messages.messages';
import populate from './constants/populate.constant';
import findById from "./constants/findById.constant";
import pagination from './constants//pagination.constant';
import { Result, ValidationError, validationResult } from 'express-validator';

class MedicosController {

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


        /* OBJETO COMPLETO DE UN MEDICO */
        const medico: Medicos = {
            NOMBRE: body.nombre,
            IMG: body.img,
            ID_USUARIO: usuarioToken.ID_USUARIO,
            ID_HOSPITAL: Number(body.id_hospital)
        };

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY DE INSERTAR / CREAR */
            const query = 'INSERT INTO MEDICOS SET ?';

            /* INSERCION / CREACION DE UN NUEVO REGISTRO */
            /* insertId: PROPIEDAD QUE DEVULVE LA QUERY */
            medico.ID_MEDICO = (await connection.query(query, [medico])).insertId;

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.create(['Medico', 'Medicos'], medico, res, usuarioToken);
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
        const query = (await pagination.pagination(desde, 'MEDICOS'));

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool.getConnection());

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
            let medicos: Medicos = await connection.query(query, [desde]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* VISUALIZAR LOS DATOS FORANEOS */
            medicos = await (await populate.init(medicos, 'HOSPITALES', res));
            medicos = await (await populate.init(medicos, 'USUARIOS', res));

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.read(['Medico', 'Medicos'], medicos, res, usuarioToken);
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
        const medico: Medicos = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!medico) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                medico
            });
            return;
        }

        /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
        if (!req.body.nombre && !req.body.id_hospital) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
        medico.ID_USUARIO = usuarioToken.ID_USUARIO;

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.nombre) medico.NOMBRE = body.nombre;

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.id_hospital) medico.ID_HOSPITAL = Number(body.id_hospital);

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool.getConnection());

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ACTUALIZAR / MODIFICAR */
            const query = 'UPDATE MEDICOS SET ? WHERE ID_MEDICO = ?';

            /* ACTUALIZA LOS DATOS */
            await connection.query(query, [medico, id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.update(['Medico', 'Medicos'], medico, usuarioToken, res);
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
        const usuarioToken: Usuarios = req.query.usuarioToken;

        /* COLECCION: DEL DATO IDENTIFICADO */
        /*
         * PARAMETROS REQUERIDOS,
         * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
         * 2.- NOMBRE DE LA TABLA.
         * 3.- COLUMNA DEL ID A BUSCAR.
         * 4.- VARIABLE DE TIPO RESPONSE
         */
        const medico: Medicos = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!medico) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                medico
            });
            return;
        }

        /* ALMACENAMIENTO DEL ID (USUARIO), QUE ACTUALIZO LA COLECCION */
        medico.ID_USUARIO = Number(usuarioToken.ID_USUARIO);

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await pool.getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ELIMINAR / QUITAR */
            const query = 'DELETE FROM MEDICOS WHERE ID_MEDICO = ?';

            /* ELIMINA LOS DATOS */
            await connection.query(query, [id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.delete(['Medico', 'Medicos'], medico, usuarioToken, res);
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


const medicosController = new MedicosController();
export default medicosController;