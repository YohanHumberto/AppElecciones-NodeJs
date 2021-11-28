const { Sequelize } = require('sequelize');
const path = require("path");

module.exports.sequelize = new Sequelize("sqlite::memory:", {
    dialect: "sqlite",
    storage: path.join(path.dirname(require.main.filename), "Util", "DB", "SistemaElecciones.sqlite"),
});

