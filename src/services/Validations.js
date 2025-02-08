export default class Validations {
    /* user auth get error message from backend */
    static getErrorMessageFromCode(errorCode) {
        switch (errorCode) {
            case "EMAIL_PASSWORD_WRONG":
                return 'Email Or Password is Wrong';
            case "USERNAME_EXISTS":
                return 'Username already exists';
            case "EMAIL_EXISTS":
                return 'Email already exists';
            default:
                return 'Unexpected error occured. Please try again.';
        }
    }

    /* master items get error message from backend */
    static getErrorMessageFromCodeMasterItem(errorCode) {
        switch (errorCode) {
            case "EMAIL_EXISTS":
                return 'Email already exists';
            default:
                return 'Unexpected error occured. Please try again.';
        }
    }

    /* customer get error message from backend */
    static getErrorMessageFromCodeCustomer(errorCode) {
        switch (errorCode) {
            case "CUSTOMER_NAME_EXISTS":
                return 'Customer name already used';
            case "EMAIL_EXISTS":
                return 'Email already exists';
            default:
                return 'Unexpected error occured. Please try again.';
        }
    }
}