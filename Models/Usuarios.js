const { DataTypes } = require('sequelize');

const { sequelize } = require('../Util/DB/connection');

const Usuarios = sequelize.define('usuarios', {
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
    Email: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    NombreDeUsuario: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Password: {
        type: DataTypes.TEXT,
         allowNull: false,
    },
    Estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = Usuarios;