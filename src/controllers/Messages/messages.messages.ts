import { Response } from 'express';
import countRows from '../constants/countRows.constant';
class Messages {

    async create(tabla: string[], collecion: Usuarios | Medicos | Hospitales, res: Response, creador?: Usuarios) {
        res.status(201).json({
            OK: true,
            POST: `${tabla[0]}: Dato Creado Correctamente.`,
            TABLA: tabla[0],
            DOCUMENTOS: (await countRows.CountRows(tabla[1], res)),
            DATOS: collecion,
            CREADOR: creador
        });
    }

    async read(tabla: string[], collecion: Usuarios | Medicos | Hospitales, res: Response, creador?: Usuarios) {
        res.status(200).json({
            OK: true,
            GET: `${tabla[0]}: Datos Obtenidos Correctamente.`,
            TABLA: tabla[0],
            DOCUMENTOS: (await countRows.CountRows(tabla[1], res)),
            DATOS: collecion,
            CREADOR: creador,
        });
    }

    async update(tabla: string[], collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(200).json({
            OK: true,
            PUT: `${tabla[0]}: Dato Actualizado Correctamente.`,
            TABLA: tabla[0],
            DOCUMENTOS: (await countRows.CountRows(tabla[1], res)),
            DATOS: collecion,
            CREADOR: creador
        });
    }

    async delete(tabla: string[], collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(200).json({
            OK: true,
            DELETE: `${tabla[0]}: Dato Eliminado Correctamente.`,
            TABLA: tabla[0],
            DOCUMENTOS: (await countRows.CountRows(tabla[1], res)),
            DATOS: collecion,
            CREADOR: creador
        });
    }

    login() {

    }

}

const messages = new Messages();
export default messages;