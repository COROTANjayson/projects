import {
    AuthTypes,
    RegisterTypes,
    RespTypes,
    UpdateProfile,
} from "../entities/Auth";
import AuthRepository from "../repositories/AuthRepository";
import { validateEmail, validatePassword } from "@/utils/utils";

export default class AuthServiceImpl {
    AuthRepo: AuthRepository;

    constructor(ir: AuthRepository) {
        this.AuthRepo = ir;
    }

    async LogoutUser(): Promise<RespTypes> {
        return this.AuthRepo.LogoutUser();
    }
    async LoginUser(payload: AuthTypes): Promise<RespTypes> {
        return this.AuthRepo.LoginUser(payload);
    }

    async Register(payload: RegisterTypes): Promise<RespTypes> {
        // add checker if the email is valid
        let error = "";
        const validEmail = validateEmail(payload.email);
        const validPassword = validatePassword(payload.password);

        if (!validEmail) {
            error = "Invalid email format!";
        }
        if (!validPassword) {
            error =
                "Password must have uppercase, lowercase, number, special character and at least 8 characters!";
        }

        if (error) {
            return {
                success: false,
                message: error,
                datas: null,
            };
        }

        return this.AuthRepo.Register(payload);
    }

    async UpdateProfile(payload: UpdateProfile): Promise<RespTypes> {
        return this.AuthRepo.UpdateProfile(payload);
    }
}
