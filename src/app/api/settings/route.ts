import getApiServerUrl from "@/server"
import {NextResponse} from "next/server";
export async function GET(){
    const data = await fetch(getApiServerUrl+"/settings/");
    switch(data.status)
    {
        case 200:
            const response = await data.json();
            return NextResponse.json(response);
        default:
            return NextResponse.json({hasErrors:true, message:"Unable to get website setting data"});
    }
}
