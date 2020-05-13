import pool from '../database/database';
import queryError from './errors/errores.error';
import populate from './constants/populate.constant';
import { Request, Response, NextFunction } from 'express';



class BusquedaController {
    constructor() {

    }

    /* BUSQUEDA ESPECIFICA: / BUSQUEDA POR COLECCION */
    public async search(req: Request, res: Response, next: NextFunction): Promise<void> {

        /* TABLA EN LA QUE SE BUSCARA */
        let tabla = req.params.tabla;

        /* VALOR QUE SE BUSCARA */
        const busqueda = req.params.busqueda;

        /* VALIDACION BASICA / REQUISITOS DE LOS PARAMETROS */
        if (tabla.trim().length < 5) {
            res.status(400).json({
                OK: false,
                GET: `Error En Los Parametros Enviados.`,
                TABLA: `El Valor Del Parametro Tabla No Es Correcto.`,
            });
            return;
        }

        /* VALIDACION BASICA / REQUISITOS DE LOS PARAMETROS */
        if (busqueda.trim().length < 3) {
            res.status(400).json({
                OK: false,
                GET: `Error En Los Parametros Enviados.`,
                TABLA: `El Valor Del Parametro Busqueda No Es Correcto.`,
            });
            return;
        }

        /* DONDE SE ALMACENAN LOS DATOS */
        let datos = null;

        /* CANTIDAD DE COINCIDENCIAS */
        let documentos = 0;


        switch (tabla) {
            /* COINCIDENCIA DEL VALOR DE LA TABLA */
            case 'usuarios':
                /* EJECUCION DE LA BUSQUEDA, Y OBTENCION DE CANTIDAD DE COINCIDENCIAS */
                const usuarios: Usuarios = await (await busquedaController.buscarUsuarios(req, res, next));
                documentos = Object.keys(usuarios).length;
                datos = usuarios;
                break;

            /* COINCIDENCIA DEL VALOR DE LA TABLA */
            case 'hospitales':
                /* EJECUCION DE LA BUSQUEDA, Y OBTENCION DE CANTIDAD DE COINCIDENCIAS */
                const hospitales: Hospitales = await (await busquedaController.buscarHospitales(req, res, next));
                documentos = Object.keys(hospitales).length;
                datos = hospitales;
                break;

            /* COINCIDENCIA DEL VALOR DE LA TABLA */
            case 'medicos':
                /* EJECUCION DE LA BUSQUEDA, Y OBTENCION DE CANTIDAD DE COINCIDENCIAS */
                const medicos: Medicos = await (await busquedaController.buscarMedicos(req, res, next));
                documentos = Object.keys(medicos).length;
                datos = medicos;
                break;

            /* OPCION POR DEFAULT */
            default:
                res.status(400).json({
                    OK: false,
                    GET: `Error En Los Parametros Enviados.`,
                    TABLA: `Los Tipos De Busqueda Solo Son Medicos, Usuarios, Hospitales`,
                    ERROR: `Tipo De Coleccion / Tabla No Valido.`
                });
                return;
        }
        // console.log(cal);
        res.status(200).json({
            OK: true,
            GET: `${tabla} Datos Obtenidos Correctamente.`,
            TABLA: tabla,
            DOCUMENTOS: documentos,
            [tabla.toUpperCase()]: datos
        });
        return;
    }

    public async find(req: Request, res: Response, next: NextFunction): Promise<void> {

        /* VALOR QUE SE BUSCARA */
        const busqueda = req.params.busqueda;

        /* VALIDACION BASICA / REQUISITOS DE LOS PARAMETROS */
        if (busqueda.trim().length < 3) {
            res.status(400).json({
                OK: false,
                GET: `Error En Los Parametros Enviados.`,
                TABLA: `El Valor Del Parametro Busqueda No Es Correcto.`,
            });
            return;
        }


        /* OBJECTO DE TODAS LAS RESPUESTAS */
        const Filtros: Filtros = {};

        /* LLAMADO A TODAS LAS BUSQUEDAS */

        /* CUANDO TODAS LAS BUSQUEDAS SE COMPLETAN, ES COMO SI FUERAN AL MISMO TIEMPO */
        Filtros.HOSPITAL = await (await busquedaController.buscarHospitales(req, res, next));
        Filtros.MEDICOS = await (await busquedaController.buscarMedicos(req, res, next));
        Filtros.USUARIOS = await (await busquedaController.buscarUsuarios(req, res, next));

        /* RESULTADO DE TODAS LAS BUSQUEDAS */
        res.status(200).json({
            Hospitales: Filtros.HOSPITAL,
            Medicos: Filtros.MEDICOS,
            Usuarios: Filtros.USUARIOS
        });
        return;
    }

    public async buscarHospitales(req: Request, res: Response, next: NextFunction): Promise<any> {

        let hospitales;
        const connection = await (await pool).getConnection();
        const busqueda = '%' + req.params.busqueda + '%';

        try {
            await connection.beginTransaction();
            const query =
                `SELECT * FROM HOSPITALES WHERE HOSPITALES.NOMBRE LIKE ?`;
            hospitales = (await connection.query(query, [busqueda]));

            await connection.commit();
            hospitales = await (await populate.init(hospitales, 'USUARIOS', res));
            // resolve(hospitales);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
            // reject(err);
        } finally {
            (await pool).releaseConnection(connection);
        }
        return hospitales;
    }

    public async buscarMedicos(req: Request, res: Response, next: NextFunction): Promise<any> {
        //     console.log('SI ENTRO')
        let medicos;
        // const usuarioToken: Usuarios = req.query.usuarioToken;
        const connection = await (await pool).getConnection();
        const busqueda = '%' + req.params.busqueda + '%';

        try {
            await connection.beginTransaction();
            const query =
                `SELECT * FROM MEDICOS WHERE MEDICOS.NOMBRE LIKE ?`;

            medicos = (await connection.query(query, [busqueda]));
            await connection.commit();
            /* VISUALIZAR LOS DATOS FORANEOS */
            medicos = await (await populate.init(medicos, 'HOSPITALES', res));
            medicos = await (await populate.init(medicos, 'USUARIOS', res));
            // resolve(hospitales);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
            // reject(err);
        } finally {
            (await pool).releaseConnection(connection);
        }
        return medicos;
    }

    public async buscarUsuarios(req: Request, res: Response, next: NextFunction): Promise<any> {
        //     console.log('SI ENTRO')
        let usuarios;
        // const usuarioToken: Usuarios = req.query.usuarioToken;
        const connection = await (await pool).getConnection();
        const busqueda = '%' + req.params.busqueda + '%';

        try {
            await connection.beginTransaction();
            const query =
                `SELECT ID_USUARIO, NOMBRE, IMG, EMAIL, ROLE, GOOGLE FROM USUARIOS WHERE USUARIOS.NOMBRE LIKE ? OR USUARIOS.EMAIL LIKE ?`;
            usuarios = (await connection.query(query, [busqueda, busqueda]));
            await connection.commit();
            // resolve(hospitales);
        } catch (err) {
            await connection.rollback();
            queryError.Query(err, res);
            // reject(err);
        } finally {
            (await pool).releaseConnection(connection);
        }
        return usuarios;
    }

}





const busquedaController = new BusquedaController();
export default busquedaController;