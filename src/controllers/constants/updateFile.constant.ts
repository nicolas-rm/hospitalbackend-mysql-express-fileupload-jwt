import pool from "../../database/database";
import messages from "../Messages/messages.messages";
import queryError from "../errors/errores.error";
import { Response } from 'express';
export default {
    async updateFile(id: number, tabla: string, collecion: Medicos | Usuarios | Hospitales, columna: string, res: Response) {
        /* HABRE UNA CONECCION CON LA BASE DE DATOS*/
        const connection = await (await pool).getConnection();
        try {
            /* INICIO DE TRANSACCIONES SEGURAS */
            await connection.beginTransaction();

            /* QUERY - ACTUALIZAR / MODIFICAR */
            const query = `UPDATE ${tabla} SET ? WHERE ${columna} = ?`;

            /* ACTUALIZA LOS DATOS */
            await connection.query(query, [collecion, id]);

            /* GUARDAR Y SALIR DE LA TRANSACCION SEGURA */
            await connection.commit();

            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            // messages.update(['Usuario', 'Usuarios'], usuario, usuarioToken, res);
            res.status(200).json({
                OK: true,
                PUT: `Imagen Actualizada Correctamente`,
                DATO: collecion
            });
        } catch (err) {
            /* COPIA DE SEGURIDAD DE LA TRANSACCION SEGURA */
            await connection.rollback();
            console.log(err)
            /* NOTIFICACION / MENSAJE - JSON, DEL PROPIO ESTANDAR  */
            queryError.Query(err, res);
        } finally {
            /* CERRAR LA CONECCION CON LA BASE DE DATOS */
            (await pool).releaseConnection(connection);
        }
    }
}