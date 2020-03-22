"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
    constructor() {
    }
    index(req, res) {
        res.json({
            ok: true,
            text: 'Peticion Realizada Correctamente - Index Routes.'
        });
    }
}
exports.indexController = new IndexController();
