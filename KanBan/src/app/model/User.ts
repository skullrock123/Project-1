import { FileHandle } from "./file-handle.model"


export interface User {
    emailId:String,
    username:String,
    password:String,
    profession:String,
    userImage:FileHandle

}