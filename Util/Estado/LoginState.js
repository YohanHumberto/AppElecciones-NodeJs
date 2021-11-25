

exports.LoginAdmin = null;
exports.LoginElector = { Estado: null, DIdentidad: 0 };

exports.ChageLoginAdminToFalse = () => {
    this.LoginAdmin = false;
}
exports.ChageLoginAdminToTrue = () => {
    this.LoginAdmin = true;
}
exports.ChageLoginElectorToFalse = () => {
    this.LoginElector.Estado = false;
}
exports.EditLoginElector = (p) => {
    this.LoginElector = p;
}

