import { Response, Request } from 'express';


class QueryError {

    public Query(err: any, res: Response) {
        
        let Message;
        let Status: number = 500;

        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.error(err);
                Status = 500;
                Message = `La Tabla: ${err.sqlMessage} No Existe.`
            }
            if (err.code === 'ER_PARSE_ERROR') {
                console.error(err);
                Status = 500;
                Message = `Error En La Sintaxis: ${err.sqlMessage}.`
            }
            if (err.code === 'ER_BAD_NULL_ERROR') {
                console.error(err);
                Message = `El Campo: ${err.sqlMessage} No Puede Ir Vacio,`
            }
            if (err.code === 'ER_DUP_ENTRY') {
                console.error(err);
                Status = 409;
                Message = `El Dato Ingresado ${err.sqlMessage} Ya Existe, Y Debe De Ser Unico.`
            }
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                console.error(err);
                Status = 500;
                Message = `El Valor Desconocido ${err.sqlMessage} No Utilizable.`
            }
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                console.error(err);
                Status = 500;
                Message = `El Valor Referenciado A La Relacion ${err.sqlMessage} No Es Utilizable.`
            }
            // console.error(err);
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
export default queryError;