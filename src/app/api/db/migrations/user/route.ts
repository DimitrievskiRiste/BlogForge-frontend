import {NextResponse} from "next/server";
import getApiServerUrl from '@/server'
import {DBConnection} from "@/Types/DBConnection";
export async function POST(req:Request)
{
    try {
        const data = await req.formData();
        const response = await fetch(getApiServerUrl+"/install/db/user/add", {
            method:"POST",
            body:data
        });
        const responseData :DBConnection = await response.json();
        return NextResponse.json(responseData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({hasErrors:true, message:"Failed to create admin account."});
    }
}
