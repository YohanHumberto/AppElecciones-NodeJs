const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Candidatos = connection.db.define('candidatos', {
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
    PartidoId: {
        type: DataTypes.NUMBER,
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
