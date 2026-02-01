import { AuthApi } from "@/api/AuthApi";
import { AuthUser } from "@/types/Auth";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const AuthService = {

    async login(authUser: AuthUser): Promise<void> {

        try {
            const auth = await AuthApi.login(authUser);
            return auth.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeUser,
                FALLBACK_MESSAGE
            )
        }
    },

    async register(authUser: AuthUser): Promise<void> {
        try {
            const auth = await AuthApi.register(authUser);
            return auth.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeUser,
                FALLBACK_MESSAGE
            )
        }
    },

    async logout(): Promise<void> {
        try {
            await AuthApi.logout();
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeUser,
                FALLBACK_MESSAGE
            )
        }
    },
};