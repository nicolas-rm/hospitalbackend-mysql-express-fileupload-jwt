import { Request, Response } from 'express';
import pool from '../database/database';
import populate from './constants/populate.constant';
import messages from './Messages/messages.messages';
import queryError from './errors/errores.error';


class BusquedaController {
    constructor() {

    }

    public async read(req: Request, res: Response): Promise<void> {


        const usuarioToken: Usuarios = req.query.usuarioToken;
        const connection = await (await pool).getConnection();
        // // let query = ''
        const busqueda = '%' + req.params.busqueda + '%';
        // const desde = Number(req.query.offset);
        // const query = (await pagination.pagination(desde, 'HOSPITALES'));
        try {
            await connection.beginTransaction();
            const query = `SELECT HOSPITALES.ID_HOSPITAL, HOSPITALES.NOMBRE AS HOSPITAL, MEDICOS.ID_MEDICO, MEDICOS.NOMBRE AS MEDICO, MEDICOS.ID_HOSPITAL AS FK_HOSPITAL FROM MEDICOS, HOSPITALES WHERE HOSPITALES.ID_HOSPITAL = MEDICOS.ID_HOSPITAL AND HOSPITALES.NOMBRE LIKE ? OR MEDICOS.NOMBRE LIKE ?`;
            const result = await connection.query(query, [busqueda, busqueda]);
            await connection.commit();
            res.status(200).json({
                result
            });

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
    }

}

export const busquedaController = new BusquedaController();
