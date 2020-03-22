"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryError {
    constructor() {
    }
    Query(err, res) {
        let Message;
        let Status = 500;
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.error(err);
                Status = 500;
                Message = `La Tabla ${err.sqlMessage} No Existe.`;
            }
            if (err.code === 'ER_PARSE_ERROR') {
                console.error(err);
                Status = 500;
                Message = `Error En La Sintaxis ${err.sqlMessage}.`;
            }
            if (err.code === 'ER_BAD_NULL_ERROR') {
                console.error(err);
                Message = `El Campo ${err.sqlMessage} No Puede Ir Vacio,`;
            }
            if (err.code === 'ER_DUP_ENTRY') {
                console.error(err);
                Status = 409;
                Message = `El Dato Ingresado ${err.sqlMessage} Ya Existe, Y Debe De Ser Unico.`;
            }
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.error(err);
                Status = 500;
                Message = `Columna ${err.sqlMessage} No Existe.`;
            }
            res.status(Status).json({
                OK: false,
                code: err.code,
                Message
            });
            return;
        }
    }
}
const queryError = new QueryError();
exports.default = queryError;
