"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const hospitales_controller_1 = __importDefault(require("../../controllers/hospitales.controller"));
class HospitalesFunctions {
    cread() {
        return [express_validator_1.check(['nombre']).trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            express_validator_1.check('img').trim().isLength({ min: 3 }).withMessage('Error En El Atributo Img | Valor'),
            hospitales_controller_1.default.create];
    }
    read() {
        return hospitales_controller_1.default.read;
    }
    update() {
        return [express_validator_1.check(['nombre']).optional().trim().isLength({ min: 3 }).withMessage('Error En El Atributo Nombre | Valor'),
            hospitales_controller_1.default.update];
    }
    delete() {
        return hospitales_controller_1.default.delete;
    }
}
const hospitalesFunctions = new HospitalesFunctions();
exports.default = hospitalesFunctions;
