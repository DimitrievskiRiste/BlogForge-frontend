import {createContext} from "react";
import {UserData} from "@/Types/UserTypes";
export type SettingData = {
    id:number;
    website_name:string;
    website_logo?:number;
    registration_enabled?:boolean;
    registration_min_age:number;
    verify_email_address:boolean;
    tos_text?:string;
    privacy_text?:string;
}
export type ImageData = {
    mime_type:string
    blob:string
}
export type ServerData = {
    setting?:SettingData
    image?:ImageData
    hasErrors?:boolean
    message?:string
}
export const AppContext = createContext<ServerData>({});
export const UserContext = createContext<UserData>(null);
