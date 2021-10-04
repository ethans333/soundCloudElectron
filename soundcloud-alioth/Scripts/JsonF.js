const fs = require('fs');

module.exports = {
    get: () => JSON.parse(fs.readFileSync("./JSON/Runtime.json")),
    update: (dataJSON) => fs.writeFileSync("./JSON/Runtime.json", JSON.stringify(dataJSON))
};