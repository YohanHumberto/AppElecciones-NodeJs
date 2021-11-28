const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const Votos = sequelize.define('votos', {
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

module.exports = Votos;