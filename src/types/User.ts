export interface UserState {
    currentUser: User | null;

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