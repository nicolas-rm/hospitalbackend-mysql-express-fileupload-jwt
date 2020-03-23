"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const medicos_controller_1 = __importDefault(require("../../controllers/medicos.controller"));
class MedicosFunctions {
    constructor() {
    }
    create() {
        return [express_validator_1.check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            express_validator_1.check('img').trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
            express_validator_1.check('id_hospital').isInt().trim().isLength({ min: 1 }).withMessage('Error En El Atributo Hospital | Valor'),
            medicos_controller_1.default.create];
    }
    read() {
        return medicos_controller_1.default.read;
    }
    update() {
        return [express_validator_1.check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            express_validator_1.check('id_hospital').isInt().trim().isLength({ min: 1 }).withMessage('Error En El Atributo Hospital | Valor'),
            medicos_controller_1.default.update];
    }
    delete() {
        return medicos_controller_1.default.delete;
    }
}
const medicosFunctions = new MedicosFunctions();
exports.default = medicosFunctions;
