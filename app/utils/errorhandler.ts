export class ErrorHandler {

  static USER_NOT_FOUND: string = "You are not logged in! Cannot access any data!";

  public static handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
