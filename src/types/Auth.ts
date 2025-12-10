export interface AuthState {
    authUser: AuthUser | null;
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
