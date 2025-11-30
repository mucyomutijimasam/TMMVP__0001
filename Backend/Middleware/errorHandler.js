// Middleware/errorHandler.js

module.exports = (err, req, res, next) => {
    // Timestamp
    const time = new Date().toISOString();

    // Log EVERYTHING server-side (production apps use Winston or pino)
    console.error("----------- ERROR LOG -----------");
    console.error("Time:", time);
    console.error("Message:", err.message);
    if (err.stack) console.error("Stack:", err.stack);
    if (err.code) console.error("Code:", err.code);        // MySQL error codes
    if (err.sqlMessage) console.error("SQL Message:", err.sqlMessage);
    console.error("---------------------------------");

    // DO NOT EXPOSE INTERNAL ERRORS TO CLIENT
    let status = err.status || 500;
    let message = "Internal server error";

    // Joi Validation Error
    if (err.isJoi === true) {
        status = 400;
        message = "Validation failed";
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        status = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        status = 401;
        message = "Token expired";
    }

    // MySQL errors (safe general message)
    if (err.code && err.code.startsWith("ER_")) {
        status = 400;
        message = "Database operation failed";
    }

    // Send clean client response
    return res.status(status).json({
        ok: false,
        message
    });
};
