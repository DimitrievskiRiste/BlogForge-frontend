import {NextRequest, NextResponse} from "next/server";
import getApiServerUrl from "@/server";
import {UserData} from "@/Types/UserTypes";
import {cookies} from "next/headers";
const protectedAdminRoutes = [
    '^/admin$',
    '^/admin/.*',
];
export async function middleware(request:NextRequest)
{
    const {pathname, search} = request.nextUrl;
    console.log(search);
    const ip = request.headers.get('X-Forwarded-For');
    console.log(`[Middleware] Incoming request from ${ip} path: ${pathname}`);
    const c = await request.cookies;
    console.log(c.get('token')?.value);
    for(const value of protectedAdminRoutes)
    {
        const regex = new RegExp(value);
        if(regex.test(pathname) && !pathname.startsWith("/admin/logout") && !pathname.startsWith("/admin/login")){
            console.log(`[Middleware] Triggered protected route ${value}, full path: ${pathname + search}`);

            if(!c.get('token') || !c.get('tokenPass') || !c.get('secret') && !c.get('user'))
            {
                console.log("[Middleware]: Client doesn't have cookies, redirecting to login!");
                return NextResponse.redirect(new URL("/admin/login", request.url));
            } else {
                const token = c?.get('token')?.value, secret = c?.get('secret')?.value,
                    tokenPass = c?.get('tokenPass')?.value, user = c?.get('user')?.value;
                if(token && secret && tokenPass && user)
                {
                    const parsedUser :UserData = JSON.parse(user);
                    const authData = await isUserAuthenticated(token, tokenPass, secret);
                    console.log(authData);
                    if(authData.isAuthenticated && authData.user && authData.user.group.can_access_admincp)
                    {
                        // We have access to admin control panel, let him continue
                        console.log("[Middleware]: Client is authorized, continuing!");
                        return NextResponse.next();
                    } else {
                        console.log("[Middleware] Client is not logged in, redirecting.");
                        return NextResponse.redirect(new URL("/admin/login", request.url));
                    }
                }
            }
        }
    }
}
type ResponseType = {
    isAuthenticated:boolean,
    user?:UserData
}
async function isUserAuthenticated(token:string, tokenPass:string, secret:string) :Promise<ResponseType>{
    const response = await fetch(getApiServerUrl+"/verify",{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${token}`,
            "Authorization-Pass":`${secret}`,
            "Token-Pass":`${tokenPass}`
        }
    });
    switch(response.status)
    {
        case 200: {
            // we were able to get OK status.
            const data :ResponseType = await response.json();
            return data;
        }
        default : {
            return {isAuthenticated:false}
        }
    }
}

