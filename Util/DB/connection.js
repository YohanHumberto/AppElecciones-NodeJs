const { Sequelize } = require('sequelize');

module.exports.db = new Sequelize('bd_sistema_de_elecciones', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    //  logging: false
});

module.exports.conectar = async () => {
    try {
        await this.db.authenticate();
        console.log('Conexion a BD exitosa');
    } catch (error) {
        console.log(error);
    }
}
