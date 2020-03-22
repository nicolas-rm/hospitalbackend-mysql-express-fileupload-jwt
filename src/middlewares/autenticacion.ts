import SEED from '../configurations/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verificaToken = function (req: Request, res: Response, next: NextFunction) {
    /* PODER RECIBIR PARAMETROS OPCIONALES */
    const token = req.query.token;


    const json = jwt.verify(token, SEED, (err: any, decoded: any) => {
        if (err) {
            res.status(401).json({
                TOKEN: 'TOKEN INVALIDO',
                err
            });
            return;
        }
        req.query.usuarioToken = decoded.usuario;
        next();
        // res.status(200).json({
        //     TOKEN: 'TOKEN VALIDO',
        //     Decoded: decoded
        // });
    });
}

export default verificaToken;