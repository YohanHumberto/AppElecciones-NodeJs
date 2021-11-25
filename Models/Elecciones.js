const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Elecciones = connection.db.define('elecciones', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Nombre: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    FechaDeRealizacion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});