import { Response } from 'express';
class Messages {

    create(tabla: string, collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(201).json({
            OK: true,
            POST: `${tabla}: Dato Creado Correctamente.`,
            TABLA: tabla,
            DOCUMENTOS: Object.keys(collecion).length,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    read(tabla: string, collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(200).json({
            OK: true,
            GET: `${tabla}: Datos Obtenidos Correctamente.`,
            TABLA: tabla,
            DOCUMENTOS: Object.keys(collecion).length,
            DATOS: collecion,
            CREADOR: creador,
        });
    }

    update(tabla: string, collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(200).json({
            OK: true,
            PUT: `${tabla}: Dato Actualizado Correctamente.`,
            TABLA: tabla,
            DOCUMENTOS: Object.keys(collecion).length,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    delete(tabla: string, collecion: Usuarios | Medicos | Hospitales, creador: Usuarios, res: Response) {
        res.status(200).json({
            OK: true,
            DELETE: `${tabla}: Dato Eliminadi Correctamente.`,
            TABLA: tabla,
            DOCUMENTOS: Object.keys(collecion).length,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    login() {

    }

}

const messages = new Messages();
export default messages;