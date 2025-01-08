export default class Validations {
    
    static getErrorMessageFromCode(errorCode){
        switch(errorCode){
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
}
