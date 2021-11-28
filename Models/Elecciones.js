const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const Elecciones = sequelize.define('elecciones', {
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

module.exports = Elecciones;