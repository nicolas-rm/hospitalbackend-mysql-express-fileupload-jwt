import pool from '../database/database';
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import messages from './Messages/messages.messages';
import findById from "./constants/findById.constant";
import { Result, ValidationError, validationResult } from 'express-validator';
import populate from './constants/populate.constant';
import pagination from './constants//pagination.constant';


class HospitalesController {

    public async create(req: Request, res: Response): Promise<void> {

        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        const body = req.body;
        const usuarioToken: Usuarios = req.query.usuarioToken;

        const hospital: Hospitales = {
            NOMBRE: body.nombre,
            IMG: body.img,
            ID_USUARIO: Number(usuarioToken.ID_USUARIO)
        }

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            const query = 'INSERT INTO HOSPITALES SET ?';
            hospital.ID_HOSPITAL = (await connection.query(query, [hospital])).insertId;
            await connection.commit();
            messages.create('Hospital', hospital, usuarioToken, res);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);
        }

    }

    public async read(req: Request, res: Response): Promise<void> {

        const usuarioToken: Usuarios = req.query.usuarioToken;
        const connection = await (await pool).getConnection();
        // let query = '';

        const desde = Number(req.query.offset);
        const query = pagination.pagination(desde,'HOSPITALES');

        try {
            await connection.beginTransaction();
            let hospitales: Hospitales = await connection.query(query,[desde]);
            await connection.commit();
            hospitales = await (await populate.init(hospitales, 'USUARIOS', res));
            messages.read('Hospitales', hospitales, usuarioToken, res);

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        const body = req.body;
        const id = Number(req.params.id);
        const usuarioToken: Usuarios = req.query.usuarioToken
        const hospital: Hospitales = await (await findById.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));

        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Hospital Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }


        if (!req.body.nombre) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);
        if (req.body.nombre) hospital.NOMBRE = body.nombre;

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            const query = 'UPDATE HOSPITALES SET ? WHERE ID_HOSPITAL = ?';
            await connection.query(query, [hospital, id]);
            await connection.commit();
            messages.update('Hospital', hospital, usuarioToken, res);

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);

        }

    }

    public async delete(req: Request, res: Response): Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        const id = Number(req.params.id);
        const usuarioToken: Usuarios = req.query.usuarioToken
        const hospital: Hospitales = await (await findById.FindById(id, 'HOSPITALES', 'ID_HOSPITAL', res));

        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Hospital Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }

        hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            const query = 'DELETE FROM HOSPITALES WHERE ID_HOSPITAL = ?';
            const user = await connection.query(query, [id]);
            await connection.commit();
            messages.delete('Hospital', hospital, usuarioToken, res);

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);

        }
    }
}


const hospitalesController = new HospitalesController();
export default hospitalesController;