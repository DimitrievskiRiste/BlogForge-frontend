import {cookies} from "next/headers";
import getApiServerUrl from "@/server"
import {AttachmentData} from "@/Types/AttachmentStateType";
import {NextResponse} from "next/server";
import {UserData} from "@/Types/UserTypes";
export async function POST(req:Request)
{
    const c = await cookies();
    const token = c.get("token")?.value, tokenPass = c.get("tokenPass")?.value, secret = c.get("secret")?.value,
    userData = c.get("user")?.value ?? null,
        user = userData ? JSON.parse(userData) : null;
    console.log(token);
    console.log(user);
    if(token && tokenPass && secret && user && user.user.group.can_upload_attachments) {

        const data  = await req.formData();
        const api = await fetch(getApiServerUrl+"/attachments/upload", {
            headers:{
                'Authorization':`Bearer ${token}`,
                'Authorization-Pass':`${secret}`,
                'Token-Pass':`${tokenPass}`,
            },
            method:'POST',
            body:data
        });
        switch(api.status)
        {
            case 200: {
                const data :AttachmentData = await api.json();
                return NextResponse.json(data);
            }
            default : {
                return NextResponse.json({errorMessage:'Not logged in, missing upload permission or invalid file format!'}, {status:403});
            }
        }
    }
}
