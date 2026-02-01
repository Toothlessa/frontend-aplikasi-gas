import { UserApi } from "@/api/UserApi";
import { User } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const UserService = {

    async updateUser(user: User): Promise<void> {
        try {
            console.log('Service Hitted')
            await UserApi.updateUser(user);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeUser,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchDataUser(): Promise<User[]> {
        try {
            const response = await UserApi.fetchCurrentUser();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeUser,
                FALLBACK_MESSAGE
            );
        }
    },
}