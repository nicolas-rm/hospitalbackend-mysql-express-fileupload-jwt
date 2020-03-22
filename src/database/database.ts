
/**
    * IMPORTACION DE LIBRERIAS 
    * O MUDULOS NECESARIOS
    * PARA LAS CONFIGURACIONES
*/
// import express  from 'express';
import mysql from 'promise-mysql';
import key from './keys/key';



class DataBase {
    public pool: mysql.Pool;


    constructor() {
        this.pool = mysql.createPool(key.database);
        // console.log(typeof (this.pool))
        this.conexion();
    }
    public async conexion() {
        try {
            // console.log('CONEXION COMPLETA - INICIO');

            const connection = await (this.pool).getConnection();
            // const c = await (await this.pool).
            (this.pool).releaseConnection(connection);
            // console.log('CONEXION COMPLETA - FIN');
            console.log(`\nConectado a MySQL: \x1b[32m%s\x1b[0m`, 'online\n');

        } catch (err) {
            // console.error('ERROR EN LA BASE DE DATOS - INICIO');
            // queryErrors.dataBaseErrors(err);
            // console.error('ERROR EN LA BASE DE DATOS - FIN');
        }
    }
}

const database = new DataBase();
export default database.pool;