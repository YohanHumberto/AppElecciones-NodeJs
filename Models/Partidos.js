const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const Partidos = sequelize.define('partidos', {
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
    Descripcion: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Logo: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Estado: {
        type: DataTypes.BOOLEAN,
         allowNull: false,
    }
});

module.exports = Partidos;