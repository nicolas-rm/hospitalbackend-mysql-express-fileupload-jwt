import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
// import fileUplo from 'express-fileupload';




class LoadsController {

    public readOne(req: Request, res: Response) {

        const tipo = req.params.tipo;
        const img = req.params.img;

        var pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
        const pathNoImage = path.resolve(__dirname, '../../assets/no-img.jpg');

        if (!fs.existsSync(pathImage)) {
            res.sendFile(pathNoImage);
        } else {
            res.sendFile(pathImage);
        }
    }
}

export const loadsController = new LoadsController();
