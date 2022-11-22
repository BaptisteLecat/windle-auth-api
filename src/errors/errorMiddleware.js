function logError(err) {
    console.error(err)
}

function returnError(err, req, res, next) {
    return res.status(err.statusCode || 500).json({
        errors: [err]
    });
}

module.exports = {
    logError,
    returnError,
}