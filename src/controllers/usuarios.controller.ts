import pool from "../database/database";
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import findById from "./constants/findById.constant";
import queryError from './errors/errores.error';
import messages from './Messages/messages.messages';
import pagination from './constants//pagination.constant';



class UsuariosController {

    public async read(req: Request, res: Response): Promise<void> {

        const desde = Number(req.query.offset);
        const query = pagination.pagination(desde, 'USUARIOS');;
        const usuarioToken: Usuarios = req.query.usuarioToken;

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            // const query = 'SELECT ID_USUARIO, NOMBRE, EMAIL, PASSWORD, IMG, ROLE FROM USUARIOS';
            const usuarios: Usuarios = await connection.query(query, [desde]);
            console.log(usuarios);
            await connection.commit();
            messages.read('Usuarios', usuarios, usuarioToken, res);


        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);

        } finally {
            (await pool).releaseConnection(connection);
        }
    }



    public async create(req: Request, res: Response): Promise<void> {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return;
        };

        const body = req.body;
        const usuario: Usuarios = {
            NOMBRE: body.nombre,
            EMAIL: body.email,
            PASSWORD: bcrypt.hashSync(body.password, 10),
            IMG: body.img,
            ROLE: body.role
        }

        const usuarioToken: Usuarios = req.query.usuarioToken;
        const connection = await (await pool).getConnection();

        try {
            await connection.beginTransaction();
            const query = 'INSERT INTO USUARIOS SET ?';
            usuario.ID_USUARIO = (await connection.query(query, [usuario])).insertId;
            await connection.commit();
            messages.create('Usuario', usuario, usuarioToken, res);
            res.status(201).json({
                OK: true,
                POST: 'Usuario Creado Correctamente',
                USUARIOS: usuario,
                usuarioToken: req.query.usuarioToken
            });
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
        const usuarioToken: Usuarios = req.query.usuarioToken;
        const usuario: Usuarios = await (await findById.FindById(id, 'USUARIOS', 'ID_USUARIO', res));

        if (!usuario) {
            res.status(400).json({
                OK: false,
                PUT: `El Usuario Con El ID ${id} No Existe`,
                usuario
            });
            return;
        }


        if (req.body.nombre) usuario.NOMBRE = body.nombre;
        if (req.body.email) usuario.EMAIL = body.email;
        if (req.body.role) usuario.ROLE = body.role;


        if (!req.body.nombre && !req.body.email && !req.body.role) {
            res.status(302).json({
                OK: false,
                PUT: 'NO SE REALIZO NINGUN CAMBIO'
            });
            return;
        }

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            const query = 'UPDATE USUARIOS SET ? WHERE ID_USUARIO = ?';
            await connection.query(query, [usuario, id]);
            await connection.commit();
            messages.update('Usuario', usuario, usuarioToken, res);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);

        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const usuarioToken: Usuarios = req.query.usuarioToken;
        const usuario: Usuarios = await (await findById.FindById(id, 'USUARIOS', 'ID_USUARIO', res));

        if (!usuario) {
            res.status(400).json({
                OK: false,
                DELETE: `El Usuario Con El ID ${id} No Existe`,
                usuario
            });
            return;
        }

        const connection = await (await pool).getConnection();
        try {
            await connection.beginTransaction();
            const query = 'DELETE FROM USUARIOS WHERE ID_USUARIO = ?';
            const user = await connection.query(query, [id]);
            await connection.commit();
            messages.delete('Usuario', usuario, usuarioToken, res);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
        } finally {
            (await pool).releaseConnection(connection);

        }
    }
}

const usuariosController = new UsuariosController();
export default usuariosController; 