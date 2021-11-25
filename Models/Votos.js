const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Votos = connection.db.define('votos', {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    CiudadanoId: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    EleccionId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    CandidatoId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    PuestoElectivoId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
});