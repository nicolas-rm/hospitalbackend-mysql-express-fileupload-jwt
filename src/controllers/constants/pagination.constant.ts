export default {
    async pagination(desde: number, tabla: string): Promise<string> {
        let filtros = '*';
        if (tabla === 'USUARIOS') filtros = 'ID_USUARIO, NOMBRE, EMAIL, IMG, ROLE, GOOGLE';
        // if (tabla === 'HOSPITALES') filtros = '*';
        // if (desde === undefined || desde === null || desde === NaN) filtros = '*';

        if (desde >= 0) {
            const query = `SELECT ${filtros} FROM ${tabla} LIMIT 5 OFFSET ?`;
            console.log('\n');
            console.log(query);
            console.log(desde);
            console.log(tabla);
            console.log(filtros);
            console.log('\n');
            return query;
        } else {
            const query = `SELECT ${filtros} FROM ${tabla}`;
            console.log('\n');
            console.log(query);
            console.log(desde);
            console.log(tabla);
            console.log(filtros);
            console.log('\n');
            return query;
        }
    }
}