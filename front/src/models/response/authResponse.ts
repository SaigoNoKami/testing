import {IUser} from "../IUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export interface refreshResponse {
    accessToken: string;
    refreshToken: string;
}