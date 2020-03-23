import pool from '../database/database';
import { Request, Response } from 'express';
import queryError from './errors/errores.error';
import findById from "./constants/findById.constant";
import { Result, ValidationError, validationResult } from 'express-validator';

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
        const usuarioToken: Usuario = req.query.usuarioToken;

        const medico: Medicos = {
            NOMBRE: body.nombre,
            IMG: body.img,
            ID_USUARIO: usuarioToken.ID_USUARIO,
            ID_HOSPITAL: Number(body.id_hospital)
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'INSERT INTO MEDICOS SET ?';
            medico.ID_MEDICO = (await connection.query(query, [medico])).insertId;
            await connection.commit();
            res.status(201).json({
                OK: true,
                POST: 'Medico Creado Correctamente',
                Medico: medico,
                usuarioToken: req.query.usuarioToken
            });
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            pool.releaseConnection(connection);
        }

    }

    public async read(req: Request, res: Response): Promise<void> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'SELECT * FROM MEDICOS';
            const hospitales = await connection.query(query);
            await connection.commit();
            res.status(200).json({
                OK: true,
                GET: 'Carga De Hospitales Completa',
                Hospitales: hospitales,
                usuarioToken: req.query.usuarioToken
            });
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
        const usuarioToken: Usuario = req.query.usuarioToken
        const medico: Medicos = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        if (!medico) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                medico
            });
            return;
        }


        if (!req.body.nombre && req.body.id_hospital) {
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
            res.status(200).json({
                OK: true,
                PUT: 'Medico Actualizado Correctamente',
                medico,
                usuarioToken: req.query.usuarioToken
            });
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
        const usuarioToken: Usuario = req.query.usuarioToken
        const hospital: Hospitales = await (await findById.FindById(id, 'MEDICOS', 'ID_MEDICO', res));

        if (!hospital) {
            res.status(400).json({
                OK: false,
                PUT: `El Medico Con El ID ${id} No Existe`,
                hospital
            });
            return;
        }

        hospital.ID_USUARIO = usuarioToken.ID_USUARIO;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const query = 'DELETE FROM MEDICOS WHERE ID_MEDICO = ?';
            const user = await connection.query(query, [id]);
            await connection.commit();
            res.status(200).json({
                OK: true,
                DELETE: 'Medico Eliminado Correctamente',
                usuarioToken: req.query.usuarioToken
            });
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