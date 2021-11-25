const { DataTypes } = require('sequelize');

const connection = require('../Util/DB/connection');

module.exports.Usuarios = connection.db.define('usuarios', {
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