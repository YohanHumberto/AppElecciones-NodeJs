const Percentage = (valor, total) => {
    return ((valor / total) * 100) ? (valor / total) * 100 : 0;
}

exports.Percentage = Percentage;