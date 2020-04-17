import bcrypt from 'bcryptjs';
import pool from "../database/database";
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import messages from './Messages/messages.messages';
import findById from "./constants/findById.constant";
import pagination from './constants//pagination.constant';
import { validationResult, Result, ValidationError } from 'express-validator';

class UsuariosController {

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

        if (!req.body.role) body.role = 'USER_ROLE';
        /* OBJETO COMPLETO DE UN MEDICO */
        const usuario: Usuarios = {
            NOMBRE: body.nombre,
            EMAIL: body.email,
            PASSWORD: bcrypt.hashSync(body.password, 10),
            IMG: body.img,
            ROLE: body.role
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
            messages.create(['Usuario', 'Usuarios'], usuario, res, usuarioToken);
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
        const query = (await pagination.pagination(desde, 'USUARIOS'));

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* LA QUERY, RETORNA LAS COLLECION DE DATOS */
            const usuarios: Usuarios = await connection.query(query, [desde]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.read(['Usuario', 'Usuarios'], usuarios, usuarioToken, res);
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
        console.log('\n');
        console.log(body);
        console.log('\n');
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
        const usuario: Usuarios = await (await findById.FindById(id, 'USUARIOS', 'ID_USUARIO', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!usuario) {
            res.status(400).json({
                OK: false,
                PUT: `El Usuario Con El ID ${id} No Existe`,
                usuario
            });
            return;
        }

        /* VALIDAR SI NO SE RECIBE ALGUN PARAMETRO PARA ACTUALIZAR */
        if (!req.body.nombre && !req.body.email && !req.body.role) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.nombre) usuario.NOMBRE = body.nombre;

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.email) usuario.EMAIL = body.email;

        /* VALIDACION DE UN PARAMETRO - (OPCIONAL) */
        if (req.body.role) usuario.ROLE = body.role;

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ACTUALIZAR / MODIFICAR */
            const query = 'UPDATE USUARIOS SET ? WHERE ID_USUARIO = ?';

            /* ACTUALIZA LOS DATOS */
            await connection.query(query, [usuario, id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.update(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
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
        const usuario: Usuarios = await (await findById.FindById(id, 'USUARIOS', 'ID_USUARIO', res));

        /* VALIDAR SI EXISTE LA COLECCION */
        if (!usuario) {
            res.status(400).json({
                OK: false,
                DELETE: `El Usuario Con El ID ${id} No Existe`,
                usuario
            });
            return;
        }

        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();

        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ELIMINAR / QUITAR */
            const query = 'DELETE FROM USUARIOS WHERE ID_USUARIO = ?';

            /* ELIMINA LOS DATOS */
            await connection.query(query, [id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            messages.delete(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
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

const usuariosController = new UsuariosController();
export default usuariosController; 