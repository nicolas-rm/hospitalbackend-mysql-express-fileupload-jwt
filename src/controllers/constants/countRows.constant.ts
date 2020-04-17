import { Response } from 'express';
import pool from "../../database/database";
import queryError from "../errors/errores.error";


export default {
    async CountRows(table: string, res: Response) {
        console.log('ESTA ENTRANDO EN CONTAR');
        let collection: any;
        const connection = await (await pool).getConnection();

        try {
            await connection.beginTransaction();
            const query = `SELECT COUNT(*) AS DOCUMENTOS FROM ${table}`;
            collection = await connection.query(query);
            await connection.commit();

        } catch (err) {
            await connection.rollback();
            console.log(err)
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);
        }
        return collection[0].DOCUMENTOS;
    }
}