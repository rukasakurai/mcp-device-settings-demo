const { AzureFunction, Context, HttpRequest } = require("@azure/functions");

const httpTrigger = async function (context, req) {
  context.log("HTTP trigger function processed a request.");

  const contextInput = req.body.context;

  const mockResponse = {
    aperture: "f/5.6",
    whiteBalance: "daylight",
  };

  context.res = {
    status: 200,
    body: mockResponse,
  };
};

module.exports = httpTrigger;
