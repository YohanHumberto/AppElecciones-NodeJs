const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const Candidatos = sequelize.define('candidatos', {
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
    Apellido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    puestoElectivoId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Foto: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }

});


module.exports = Candidatos;


