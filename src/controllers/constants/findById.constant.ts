import pool from "../../database/database";
import queryError from "../errors/errores.error";
import { Response } from 'express';

export default {
    async FindById(id: number | string, table: string, column: string, res: Response): Promise<Usuario | any> {
        // let res: Response;
        let collection;
        const connection = await (await pool).getConnection();
        try {
            // console.log('SI ESTA ENTRANDO .....................................');
            await connection.beginTransaction();
            const query = `SELECT * FROM ${table} WHERE ${column} = ?`;
            collection = await connection.query(query, [id]);
            await connection.commit();
            // collection = usuario;
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
        return collection[0];
    }
}