export const BaseError = class BaseError extends Error {
    constructor(title, statusCode, description) {
        super(description)

        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode
        this.title = title
        this.description = description
        Error.captureStackTrace(this)
    }
}