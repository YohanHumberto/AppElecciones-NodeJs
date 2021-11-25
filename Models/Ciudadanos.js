const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Ciudadanos = connection.db.define('ciudadanos', {
    DocumentoDeIdentidad: {
        type: DataTypes.TEXT,
        primaryKey: true,
        field: 'DocumentoDeIdentidad'
    },
    Nombre: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Apellido: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Email: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Estado: {
        type: DataTypes.BOOLEAN,
         allowNull: false,
    }

});