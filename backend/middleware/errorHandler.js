import { constants } from "../constants.js";

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    let responseBody;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            responseBody = { title: "Validation Failed", message: error.message };
            break;
        case constants.NOT_FOUND:
            responseBody = { title: "Not Found", message: error.message };
            break;
        case constants.UNAUTHORIZED:
            responseBody = { title: "Unauthorized", message: error.message };
            break;
        case constants.FORBIDDEN:
            responseBody = { title: "Forbidden", message: error.message };
            break;
        case constants.SERVER_ERROR:
        default:
            responseBody = { title: "Server Error", message: error.message };
            break;
    }

    // Do not expose stack trace in production environment for security
    responseBody.stackTrace = process.env.NODE_ENV === "production" ? undefined : error.stack;
    res.status(statusCode).json(responseBody);
};

export default errorHandler;