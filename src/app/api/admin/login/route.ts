import {NextResponse} from "next/server";
import getApiServerUrl from "@/server";
import {cookies} from "next/headers";
import {UserData} from "@/Types/UserTypes";
export async function POST(req:Request)
{
    type FormData = {
        email:string
        password:string
    }
    const data :FormData = await req.json();
    console.log(data);
    if(!/^([a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+)$/.test(data.email)){
        return NextResponse.json({hasErrors:true, email:"Invalid email address"});
    }
    if(!data.password) {
        return NextResponse.json({hasErrors:true, password:"Password is required!"});
    }
    const f = new FormData();
    f.set('email', data.email);
    f.set('password', data.password);
    const res = await fetch(getApiServerUrl+"/login", {
        method:"POST",
        body:f
    });
    type ObjectData = {
        email:string
    }
    type ResErrType = {
        errors:ObjectData
    }
    if(res.status === 400) {
        const resData :ResErrType = await res.json();
        return NextResponse.json(resData);
    } else {
        type ResData = {
            token:string
            exp:number
            secret:string|number
            tokenPass:string|number
        }
        const resData :ResData = await res.json();
        const c = await cookies();
        c.set("token", resData.token, {
            expires:new Date(Date.now() + 60 * 60 * 1000),
            sameSite:'strict',
            httpOnly:true,
            path:'/'
        });
        c.set('secret', resData.secret, {
            expires:new Date(Date.now() + 60 * 60 * 1000),
            sameSite:'strict',
            httpOnly:true,
            path:'/'
        });
        c.set('tokenPass', resData.tokenPass.toString(),{
            expires:new Date(Date.now() + 60 + 60 * 1000),
            sameSite:"strict",
            httpOnly:true,
            path:'/'
        });
        // now let's verify if we have right permissions
        const verify = await fetch(getApiServerUrl+"/verify",{
            headers:{
                'Authorization':`Bearer ${resData.token}`,
                'Authorization-Pass':`${resData.secret}`,
                'Token-Pass':`${resData.tokenPass}`
            }
        });
        type VerifyData = {
            isAuthenticated:boolean
            user:UserData
        }
        const verifyData :VerifyData = await verify.json();
        console.log(verifyData);
        if(verifyData.user.group.can_access_admincp)
        {
            const response = NextResponse.json({isLoggedIn:true, isAdmin:true, user:verifyData.user, token:resData.token, tokenPass:resData.tokenPass, secret:resData.secret});
            c.set('user', JSON.stringify(verifyData), {
                expires:new Date(Date.now() + 60 * 60 * 1000),
                sameSite:'strict',
                path:'/',
                httpOnly:true
            });
            response.cookies.set('user', JSON.stringify(verifyData), {
                expires:new Date(Date.now() + 60 * 60 * 1000),
                sameSite:'strict',
                path:'/',
                httpOnly:true
            });
            response.cookies.set('token', resData.token, {
                expires:new Date(Date.now() + 60 * 60 * 1000),
                sameSite:'strict',
                path:'/',
                httpOnly:true
            });
            response.cookies.set('secret', resData.secret, {
                expires:new Date(Date.now() + 60 * 60 * 1000),
                sameSite:'strict',
                path:'/',
                httpOnly:true
            });
            response.cookies.set('tokenPass', resData.tokenPass, {
                expires:new Date(Date.now() + 60 * 60 * 1000),
                sameSite:'strict',
                path:'/',
                httpOnly:true
            });
            return response;
        } else {
            c.delete('token');
            c.delete('secret');
            c.delete('tokenPass');
            console.log(verifyData);
            return NextResponse.json({isLoggedIn:true, isAdmin:false});
        }
    }
}
