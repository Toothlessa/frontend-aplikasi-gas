export interface AuthState {
    authUser: AuthUser | null;
    initialLoginForm: InitialLoginForm | null;
    initialSignupForm: InitialSignupForm | null;

    autoLogout: boolean;
    loading: boolean;
    loadingButtonCreate: boolean;
}

export interface AuthUser {
    userId: number,
    username: string,
    email: string,
    token: string,
    expiresIn: 'sdsds',
    autoLogout: false,
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