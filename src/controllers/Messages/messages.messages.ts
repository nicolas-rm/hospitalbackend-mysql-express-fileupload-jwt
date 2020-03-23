import { Response } from 'express';
class Messages {

    create(tabla: string, collecion: Usuario | Medicos | Hospitales, creador: Usuario, res: Response) {
        res.status(201).json({
            OK: true,
            POST: `${tabla}: Dato Creado Correctamente.`,
            TABLA: tabla,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    read(tabla: string, collecion: Usuario | Medicos | Hospitales, creador: Usuario, res: Response) {
        res.status(200).json({
            OK: true,
            GET: `${tabla}: Datos Obtenidos Correctamente.`,
            TABLA: tabla,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    update(tabla: string, collecion: Usuario | Medicos | Hospitales, creador: Usuario, res: Response) {
        res.status(200).json({
            OK: true,
            PUT: `${tabla}: Dato Actualizado Correctamente.`,
            TABLA: tabla,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    delete(tabla: string, collecion: Usuario | Medicos | Hospitales, creador: Usuario, res: Response) {
        res.status(200).json({
            OK: true,
            DELETE: `${tabla}: Dato Eliminadi Correctamente.`,
            TABLA: tabla,
            DATOS: collecion,
            CREADOR: creador
        });
    }

    login() {

    }

}

const messages = new Messages();
export default messages;