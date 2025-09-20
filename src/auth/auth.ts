import getApiServerUrl from "@/server"
import {AuthResponse} from "@/Types/AuthTypes";
import {SessionOption} from "@/Types/SessionTypes";
import {cookies} from "next/headers";

export async function isAuthenticated(token:string, secret:string, tokenPass:string) :Promise<AuthResponse>
{
    const req = await fetch(getApiServerUrl+"/verify", {
        headers:{
            "Authorization":`Bearer ${token}`,
            'Authorization-Pass': `${secret}`,
            'Token-Pass': `${tokenPass}`
        },
        method:'GET'
    });
    switch(req.status)
    {
        case 200: {
            return await req.json();
        }
        default : {
            return {
                isAuthenticated: false,
                user: null
            };
        }
    }
}
export async function setSession(name:string, value:string, options:SessionOption) {
    const cookie = await cookies();
    try {
        cookie.set(name.toString(),value.toString(), options);
    } catch (error) {
        console.error(error);
    }
}
