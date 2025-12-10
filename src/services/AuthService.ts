import { AuthApi } from "@/api/AuthApi";
import { AuthUser } from "@/types/Auth";
import { errorHandler } from "@/utils/ErrorHandler";

export const AuthService = {

    async login(authUser: AuthUser): Promise<void> {
        try{
            const auth = await AuthApi.login(authUser);
            return auth.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async register(authUser: AuthUser): Promise<void> {
        try{
            const auth = await AuthApi.register(authUser);
            return auth.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async logout(): Promise<void> {
        try{
            await AuthApi.logout();
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },
};