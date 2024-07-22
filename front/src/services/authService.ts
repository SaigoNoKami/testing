import $api from "../http/http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/authResponse";

export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {username, password})
    }

    static async registration(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/register', {username, password})
    }

    static async logout(userId: string): Promise<void> {
        console.log(1)
        return $api.delete(`/auth/logout/${encodeURIComponent(userId)}`)
    }
 
}