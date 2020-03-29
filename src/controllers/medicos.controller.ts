import pool from '../database/database';
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import findById from "./constants/findById.constant";
import { Result, ValidationError, validationResult } from 'express-validator';
import messages from './Messages/messages.messages';
import populate from './constants/populate.constant';
import pagination from './constants//pagination.constant';

class MedicosController {

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

        const medico: Medicos = {
            NOMBRE: body.nombre,
            IMG: body.img,
            ID_USUARIO: usuarioToken.ID_USUARIO,
            ID_HOSPITAL: Number(body.id_hospital)
        };

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'INSERT INTO MEDICOS SET ?';
            medico.ID_MEDICO = (await connection.query(query, [medico])).insertId;
            await connection.commit();
            messages.create(['Medico', 'MEDICOS'], medico, usuarioToken, res);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            pool.releaseConnection(connection);
        }

    }

    public async read(req: Request, res: Response): Promise<void> {

        const usuarioToken: Usuarios = req.query.usuarioToken;
        const desde = Number(req.query.offset);

        const query = (await pagination.pagination(desde, 'MEDICOS'));

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let medicos: Medicos = await connection.query(query, [desde]);
            await connection.commit();

            medicos = await (await populate.init(medicos, 'HOSPITALES', res));
            medicos = await (await populate.init(medicos, 'USUARIOS', res));
            messages.read(['Medico', 'MEDICOS'], medicos, usuarioToken, res);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            pool.releaseConnection(connection);
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
        const medico: Medicos = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        if (!medico) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                medico
            });
            return;
        }

        if (!req.body.nombre && !req.body.id_hospital) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        medico.ID_USUARIO = usuarioToken.ID_USUARIO;
        if (req.body.nombre) medico.NOMBRE = body.nombre;
        if (req.body.id_hospital) medico.ID_HOSPITAL = Number(body.id_hospital);


        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'UPDATE MEDICOS SET ? WHERE ID_MEDICO = ?';
            await connection.query(query, [medico, id]);
            await connection.commit();
            messages.update(['Medico', 'MEDICOS'], medico,usuarioToken,res);

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            pool.releaseConnection(connection);

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

        const body = req.body;
        const id = Number(req.params.id);
        const usuarioToken: Usuarios = req.query.usuarioToken
        const hospital: Hospitales = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }

        hospital.ID_USUARIO = Number(usuarioToken.ID_USUARIO);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'DELETE FROM MEDICOS WHERE ID_MEDICO = ?';
            await connection.query(query, [id]);
            await connection.commit();
            // messages.update(['Medico', 'MEDICOS'], medico,usuarioToken,res);

        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            pool.releaseConnection(connection);

        }
    }
}


const medicosController = new MedicosController();
export default medicosController;