const Candidatos = require("../../Models/Candidatos");
const Partidos = require("../../Models/Partidos");
const PuestoElectivo = require("../../Models/PuestoElectivo");

const Relaciones = () => {
    console.log('Relaciones Creadas');
    Candidatos.belongsTo(Partidos, { constraint: true, onDelete: "CASCADE" });
    Candidatos.belongsTo(PuestoElectivo, { constraint: true, onDelete: "CASCADE" });
    PuestoElectivo.hasMany(Candidatos);
    Partidos.hasMany(Candidatos);
}

module.exports = Relaciones;