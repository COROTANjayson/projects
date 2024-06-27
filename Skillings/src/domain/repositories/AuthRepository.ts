import {
    AuthTypes,
    RegisterTypes,
    RespTypes,
    UpdateProfile,
} from "../entities/Auth";

type AuthRepository = {
    LogoutUser(): Promise<RespTypes>;
    LoginUser(payload: AuthTypes): Promise<RespTypes>;
    Register(payload: RegisterTypes): Promise<RespTypes>;
    UpdateProfile(UpdateProfile: UpdateProfile): Promise<RespTypes>;
};

export default AuthRepository;
