import fs from 'fs';
import path from 'path';
import updateFile from './constants/updateFile.constant';
import { Request, Response } from 'express';
import findById from './constants/findById.constant';

class UploadsController {

    public async upload(req: Request, res: Response): Promise<any> {

        var tipo = req.params.tipo;
        var id = req.params.id;

        // console.log(' VALOR DE ID ');
        // console.log(req.params.id);
        // this.app.put('/upload', function (req: any, res: any) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                Message: 'NO SE A SELECCIONADO NINGUN ARCHIVO'
            });
        }

        // tipos de colección
        var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
        if (tiposValidos.indexOf(tipo) < 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Tipo de colección no es válida',
                errors: { message: 'Tipo de colección no es válida' }
            });
        }


        if (!Number(id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Valor id no es válida',
                errors: { message: 'El Valor No Es Valido' }
            });
        }
        // if (req.params.imagen) {
        //     const patURL = path.resolve(__dirname, `../../uploads/${req.params.imagen}`);

        //     if (fs.existsSync(patURL)) {
        //         fs.unlinkSync(patURL);
        //     }

        // }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const archivo: any = req.files.archivo;
        let nombreArchivo: [] = archivo.name.split('.');


        /* EXTESIONES PERMITIDAS */
        const extension = nombreArchivo[nombreArchivo.length - 1];
        const extensiones = ['jpg', 'jpeg', 'png'];

        if (extensiones.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    Message: 'LAS EXTENSIONES PERMITIDAS SON ' + extensiones.join(', ')
                },
                extension
            });
        }
        const date = new Date();
        const nombreFile: string = id + '-' + date.getFullYear() + (date.getMonth() + 1) + (date.getDay() + 1) + (date.getHours() + 1) + (date.getMinutes()) + (date.getSeconds()) + date.getMilliseconds();
        const name = nombreFile + '.' + extension;
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(`uploads/${req.params.tipo}/${name}`, async (err: any) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            await (await uploadsController.subirPorTipo(req.params.tipo, Number(req.params.id), name, res));
        });
        // });
    }

    public async subirPorTipo(tipo: string, id: number, nombreImagen: string, res: Response): Promise<void> {

        if (tipo === 'usuarios') {
            /* COLECCION: DEL DATO IDENTIFICADO */
            /*
             * PARAMETROS REQUERIDOS,
             * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
             * 2.- NOMBRE DE LA TABLA.
             * 3.- COLUMNA DEL ID A BUSCAR.
             * 4.- VARIABLE DE TIPO RESPONSE
             */
            const usuario: Usuarios = await (await findById.FindById(id, 'USUARIOS', 'ID_USUARIO', res));

            /* VALIDAR SI EXISTE UNA COLLECION */
            const next: Boolean = await (await uploadsController.validarCollecion(id, usuario, 'Usuario', tipo, nombreImagen, res));

            if (next) {
                /* SUBIR LA NUEVA IMAGEN */
                uploadsController.uploadFile(tipo, usuario.IMG);
                /* ACTUALIZAR LA COLLECION */
                usuario.IMG = nombreImagen;
                await (await updateFile.updateFile(id, tipo, usuario, 'ID_USUARIO', res));
            }

        }
        if (tipo === 'medicos') {
            /* COLECCION: DEL DATO IDENTIFICADO */
            /*
             * PARAMETROS REQUERIDOS,
             * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
             * 2.- NOMBRE DE LA TABLA.
             * 3.- COLUMNA DEL ID A BUSCAR.
             * 4.- VARIABLE DE TIPO RESPONSE
             */
            const medico: Medicos = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

            /* VALIDAR SI EXISTE UNA COLLECION */
            const next: Boolean = await (await uploadsController.validarCollecion(id, medico, 'Medico', tipo, nombreImagen, res));

            if (next) {
                /* SUBIR LA NUEVA IMAGEN */
                uploadsController.uploadFile(tipo, medico.IMG);
                /* ACTUALIZAR LA COLLECION */
                console.log('IMG', medico.IMG);
                medico.IMG = nombreImagen;
                await (await updateFile.updateFile(id, tipo, medico, 'ID_MEDICO', res));
            }
        }
        if (tipo === 'hospitales') {
            /* COLECCION: DEL DATO IDENTIFICADO */
            /*
             * PARAMETROS REQUERIDOS,
             * 1.- ID: IDENTIFICADOR UNICO A BUSCAR.
             * 2.- NOMBRE DE LA TABLA.
             * 3.- COLUMNA DEL ID A BUSCAR.
             * 4.- VARIABLE DE TIPO RESPONSE
             */
            const hospital: Hospitales = await (await findById.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));

            /* VALIDAR SI EXISTE UNA COLLECION */
            const next: Boolean = await (await uploadsController.validarCollecion(id, hospital, 'Hospital', tipo, nombreImagen, res));

            if (next) {
                /* SUBIR LA NUEVA IMAGEN */
                uploadsController.uploadFile(tipo, hospital.IMG);
                /* ACTUALIZAR LA COLLECION */
                hospital.IMG = nombreImagen;
                await (await updateFile.updateFile(id, tipo, hospital, 'ID_HOSPITAL', res));
            }
        }
    }

    private async validarCollecion(id: number, collecion: Usuarios | Medicos | Hospitales, mss: string, tipo: string, nombreImagen: string, res: Response): Promise<Boolean> {

        if (!collecion) {
            const pathURL = path.resolve(`./uploads/${tipo}/${nombreImagen}`);
            if (fs.existsSync(pathURL)) {
                fs.unlinkSync(pathURL);
            }

            res.status(400).json({
                OK: false,
                PUT: `El ${mss} Con El ${id} No Existe`,
                collecion
            });
            return false;
        }
        return true;
    }

    private async uploadFile(tipo: string, nombreImagen: string) {
        const pathURL = path.resolve(`uploads/${tipo}/${nombreImagen}`);
        if (fs.existsSync(pathURL)) {
            fs.unlinkSync(pathURL);
        }
    }
}

const uploadsController = new UploadsController();
export default uploadsController;