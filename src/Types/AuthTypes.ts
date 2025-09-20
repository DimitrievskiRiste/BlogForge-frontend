import {UserData} from "@/Types/UserTypes";

export type AuthResponse = {
    isAuthenticated:boolean
    user:UserData|null
}
