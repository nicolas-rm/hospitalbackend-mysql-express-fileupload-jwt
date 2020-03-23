import { Result, ValidationError, validationResult } from "express-validator";
import { Request, Response } from 'express';
class Validations {

    constructor() {

    }
    public async requiere(req: Request, res: Response): Promise<boolean> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return false;
        };
        return true;
    }
}

const validations = new Validations();
export default validations;