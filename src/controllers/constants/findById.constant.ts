import { Response } from 'express';
import pool from "../../database/database";
import queryError from "../errors/errores.error";


export default {
    async FindById(id: number | string, table: string, column: string, res: Response): Promise<Usuarios | Hospitales | Medicos | any> {

        let collection;
        const connection = await (await pool).getConnection();
        
        try {
            await connection.beginTransaction();
            const query = `SELECT * FROM ${table} WHERE ${column} = ?`;
            collection = await connection.query(query, [id]);
            await connection.commit();
            
        } catch (err) {        
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
        return collection[0];
    }
}