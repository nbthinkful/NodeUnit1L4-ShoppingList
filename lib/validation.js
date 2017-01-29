'use strict';

const validProperty = Symbol();
const messageProperty = Symbol();

class ValidationResult {
    constructor(valid, message) {
        if (message == undefined) {
            message = null;
        }
        this[validProperty] = valid;
        this[messageProperty] = message;
    }

    get isValid() {
        return this[validProperty];
    }

    get message() {
        return this[messageProperty];
    }
}

class Validator {
    constructor() {
    }

    validate(req) {
        for (let i=1; i<arguments.length; i++) {
            const field = arguments[i];
            if (!(field in req.body)) {
                return new ValidationResult(false, `Missing [${field}] in request body`);
            }
        }

        return new ValidationResult(true);
    }
}

module.exports = new Validator();