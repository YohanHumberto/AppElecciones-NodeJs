const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Partidos = connection.db.define('partidos', {
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