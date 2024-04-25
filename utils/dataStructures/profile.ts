import { Publisher } from "./publisher";

export interface Profile {
    bio: string,
    publisher: Publisher,
    id?: number
}