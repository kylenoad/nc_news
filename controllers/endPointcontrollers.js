const endpointsJson = require("../endpoints.json");

const getApiEndpoints = (request, response, next) =>{
    response.status(200).send({ endpoints: endpointsJson })
}

module.exports = {getApiEndpoints}