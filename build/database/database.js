"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
    * IMPORTACION DE LIBRERIAS
    * O MUDULOS NECESARIOS
    * PARA LAS CONFIGURACIONES
*/
// import express  from 'express';
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const key_1 = __importDefault(require("./keys/key"));
class DataBase {
    constructor() {
        this.pool = promise_mysql_1.default.createPool(key_1.default.database);
        // console.log(typeof (this.pool))
        this.conexion();
    }
    conexion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('CONEXION COMPLETA - INICIO');
                const connection = yield (this.pool).getConnection();
                // const c = await (await this.pool).
                (this.pool).releaseConnection(connection);
                // console.log('CONEXION COMPLETA - FIN');
                console.log(`\nConectado a MySQL: \x1b[32m%s\x1b[0m`, 'online\n');
            }
            catch (err) {
                // console.error('ERROR EN LA BASE DE DATOS - INICIO');
                // queryErrors.dataBaseErrors(err);
                // console.error('ERROR EN LA BASE DE DATOS - FIN');
            }
        });
    }
}
const database = new DataBase();
exports.default = database.pool;
