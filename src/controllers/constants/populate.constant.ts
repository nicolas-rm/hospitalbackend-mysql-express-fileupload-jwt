import { Response } from 'express';
import pool from "../../database/database";
import queryError from "../errors/errores.error";

class Populate {

    public async init(collecion: Medicos | Hospitales, tabla: string, res: Response): Promise<Medicos | Hospitales | any> {
        let colleciones: Medicos | Hospitales[] = [];
        for (let index = 0; index < Object.keys(collecion).length; index++) {
            const objectDatos = Object.create(collecion)[index];
            if (tabla === 'USUARIOS') {
                const usuarios = await (await this.poppulate(Number(objectDatos.ID_USUARIO), tabla, res));
                objectDatos.ID_USUARIO = usuarios;
                // console.log(objectDatos);
            } else if (tabla === 'MEDICOS') {
                const medicos = await (await this.poppulate(Number(objectDatos.ID_MEDICO), tabla, res));
                objectDatos.ID_MEDICO = medicos;
                // console.log(objectDatos);
            } else if (tabla === 'HOSPITALES') {
                const hospitales = await (await this.poppulate(Number(objectDatos.ID_HOSPITAL), tabla, res));
                objectDatos.ID_HOSPITAL = hospitales;
                // console.log(objectDatos);
            }
            colleciones.push(objectDatos);
        }
        // console.log(colleciones);
        return colleciones;
    }
    private async poppulate(id: number, tabla: string, res: Response): Promise<Hospitales | Medicos | any> {

        let datos;
        let query: string = '';

        if (tabla === 'USUARIOS') {
            query = `SELECT ID_USUARIO, NOMBRE, EMAIL FROM ${tabla} WHERE ID_USUARIO = ?`;
        } else if (tabla === 'HOSPITALES') {
            query = `SELECT ID_HOSPITAL, NOMBRE FROM ${tabla} WHERE ID_HOSPITAL = ?`;
        } else if (tabla === 'MEDICOS') {
            query = `SELECT * FROM ${tabla} WHERE ID_HOSPITAL = ?`;
        }

        // console.log(query);
        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            datos = await connection.query(query, [id]);
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
        // console.log(datos);
        return datos[0];
    }

}

const populate = new Populate();
export default populate;