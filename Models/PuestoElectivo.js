const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const PuestoElectivo = sequelize.define('puesto_electivos', {
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

module.exports = PuestoElectivo;