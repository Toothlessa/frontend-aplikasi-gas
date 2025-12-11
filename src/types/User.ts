export interface UserState {
  currentUser: User | null;
  initialLoginForm: InitialLoginForm | null;
  initialSignupForm: InitialSignupForm | null;
  loading: boolean;
  loadingOne: boolean;
  loadingButtonCreate: boolean;
  loadingButtonUpdate: boolean;
  hasSaved: boolean;
}

export interface User {
  id: number,
  username: string,
  email: string,
}

export interface InitialLoginForm {
  email: string,
  password: string,
}

export interface InitialSignupForm {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
}
