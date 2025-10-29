export default class Validations {
  /**
   * User Auth — get error message from backend
   */
  static getErrorMessageFromCodeUser(errorCode: string): string {
    switch (errorCode) {
      case "EMAIL_PASSWORD_WRONG":
        return "Email or password is wrong.";
      case "USERNAME_EXISTS":
        return "Username already exists.";
      case "EMAIL_EXISTS":
        return "Email already exists.";
      default:
        return "Unexpected error occurred. Please try again.";
    }
  }

  /**
   * Master Items — get error message from backend
   */
  static getErrorMessageFromCodeMasterItem(errorCode: string): string {
    switch (errorCode) {
      case "The item name field is required.":
        return "Please fill in the item name.";
      case "The category id field is required.":
        return "Please fill in the category.";
      case "The cost of goods sold field is required.":
        return "Please fill in the cost of goods.";
      case "The selling price field is required.":
        return "Please fill in the selling price.";
      default:
        return "Unexpected error occurred. Please try again.";
    }
  }

  /**
   * Customer — get error message from backend
   */
  static getErrorMessageFromCodeCategoryItem(errorCode: string): string {
    switch (errorCode) {
      case "NAME_EXISTS":
        return "Category item name already exists.";
      default:
        return "Unexpected error occurred. Please try again.";
    }
  }

  static getErrorMessageFromCodeCustomer(errorCode: string): string {
    switch (errorCode) {
      case "CUSTOMER_NAME_EXISTS":
        return "Customer name already used.";
      case "EMAIL_EXISTS":
        return "Email already exists.";
      case "The customer name field is required.":
        return "Please fill in the customer name.";
      case "The customer type field is required.":
        return "Please fill in the customer type.";
      case "The type field is required.":
        return "Please select a customer type.";
      case "The csv file failed to upload.":
        return "Failed to upload CSV file, please try again.";
      case "The csv file field must be a file of type: csv, txt.":
        return "CSV file error, please check the file format and try again.";
      default:
        return "Unexpected error occurred. Please try again.";
    }
  }
}
