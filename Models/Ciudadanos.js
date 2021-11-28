const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');


const Ciudadanos = sequelize.define('ciudadanos', {
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

module.exports = Ciudadanos;