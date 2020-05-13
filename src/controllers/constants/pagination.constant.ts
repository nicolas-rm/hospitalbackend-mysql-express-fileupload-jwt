export default {
    async pagination(desde: number, tabla: string): Promise<string> {
        let filtros;
        if (tabla === 'USUARIOS') filtros = 'ID_USUARIO, NOMBRE, EMAIL, IMG, ROLE, GOOGLE' || '*';

        if (desde >= 0) {
            return `SELECT ${filtros} FROM ${tabla} LIMIT 5 OFFSET ?`;
        } else {
            return `SELECT ${filtros} FROM ${tabla}`;
        }
    }
}