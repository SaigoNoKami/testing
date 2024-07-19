export interface IMessage {
    id: string,
    fromUserID: string;
    toUserID: string;
    message: string;
    filesURL: Array<string>;
    time: string;
}
