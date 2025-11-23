import { UserApi } from "@/api/UserApi";
import { User } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";

export const UserService = {

    async updateUser(user: User): Promise<void>{
        try{
            console.log('Service Hitted')
            await UserApi.updateUser(user);
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchDataUser(): Promise<User[]>{
        try{
            const response = await UserApi.fetchCurrentUser();
            return response.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },
}