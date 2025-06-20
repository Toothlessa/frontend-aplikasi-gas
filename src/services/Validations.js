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
            case "The customer name field is required.":
              return "Please fill in the customer name";
            case "The type field is required.":
                return 'Please select a customer type';
            case "The csv file failed to upload.":
                return 'Failed to upload CSV file, please try again.';
            case "The csv file field must be a file of type: csv, txt.":
                return 'Csv file error, please check the file format and try again.';
            default:
                return 'Unexpected error occured. Please try again.';
        }
    }
}