const fixLongText = (s, mL) => {
    (mL) ? maxLength = mL : maxLength = 10;

    if (s.length > maxLength) {
        return s.slice(0, maxLength).concat("...")
    } else {
        return s;
    };
};

module.exports = { fixLongText };