import { Request, Response } from 'express';


class IndexController {
    constructor() {

    }

    public index(req: Request, res: Response) {
        res.json({
            ok: true,
            text: 'Peticion Realizada Correctamente - Index Routes.'
        });
    }

}

export const indexController = new IndexController();
