import { Request, Response } from 'express';


class HospitalesController {
    public async create(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            OK: true,
            POST: 'CREAR HOSPITALES'
        });
    }
    public async read(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            OK: true,
            GET: 'LEER HOSPITALES'
        });
    }
    public async update(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            OK: true,
            PUT: 'ACTUALIZAR HOSPITALES'
        });
    }
    public async delete(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            OK: true,
            DELETE: 'ELIMINAR HOSPITALES'
        });
    }
}


const hospitalesController = new HospitalesController();
export default hospitalesController;