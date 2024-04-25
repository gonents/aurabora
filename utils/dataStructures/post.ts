import { Publisher } from "./publisher";
import { SomeJson } from "./some-json";
import { Status } from "./status";

export interface Post {
    title: string,
    content: string,
    someJsons: [SomeJson],
    status: Status,
    published: Boolean,
    publisher: Publisher,
    id?: number
}