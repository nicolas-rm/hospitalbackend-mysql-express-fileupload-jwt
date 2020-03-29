export default {
    pagination(desde: number, tabla: string) {
        if (desde >= 0) {
            return `SELECT * FROM ${tabla} LIMIT 5 OFFSET ?`;
        } else {
            return `SELECT * FROM ${tabla}`;
        }
    }
}