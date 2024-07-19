import { AxiosResponse } from 'axios';
import $api from "../http/http";
import { IMessage } from '../models/IMessages';

export default class messageService {
    static fetchChat(user1: string, user2: string): Promise<AxiosResponse<IMessage[]>> {
        return $api.get<IMessage[]>(`/message/chat?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`);
    }

    static sendMessage(data: FormData): Promise<AxiosResponse<IMessage>> {
        return $api.post<IMessage>('/message/send', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    static deleteMessage(messageId: string): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/message/delete/${encodeURIComponent(messageId)}`);
    }

    static updateMessage(messageId: string, message: string): Promise<AxiosResponse<IMessage>> {
        return $api.patch<IMessage>(`/message/update/${encodeURIComponent(messageId)}`, {message});
    }


}
