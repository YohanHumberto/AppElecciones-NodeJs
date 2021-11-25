const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.PuestoElectivo = connection.db.define('puesto_electivos', {
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
    Estado: {
        type: DataTypes.BOOLEAN,
         allowNull: false,
    }
});