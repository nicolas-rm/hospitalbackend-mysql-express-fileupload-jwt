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
const database_1 = __importDefault(require("../../database/database"));
exports.default = {
    FindById(id, table, column) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection;
            const connection = yield (yield database_1.default).getConnection();
            try {
                // console.log('SI ESTA ENTRANDO .....................................');
                yield connection.beginTransaction();
                const query = `SELECT * FROM ${table} WHERE ${column} = ?`;
                collection = yield connection.query(query, [id]);
                yield connection.commit();
                // collection = usuario;
            }
            catch (err) {
                yield connection.rollback();
            }
            finally {
                (yield database_1.default).releaseConnection(connection);
            }
            return collection[0];
        });
    }
};
