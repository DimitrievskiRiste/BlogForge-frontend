import {NextResponse} from "next/server";
import getApiServerUrl from "@/server";
import {DBConnection} from "@/Types/DBConnection";
export async function POST(req:Request){
   try {
       const data = await req.formData();
       // Since we validate files on backend, we don't need any extra validation here.
       const response = await fetch(getApiServerUrl+"/install/db/settings/add", {
           method:"POST",
           body:data
       });
       const resData :DBConnection = await response.json();
       if(resData.success) {
           // Let's now lock the installation
            await fetch(getApiServerUrl+"/install/lock", {
               method: "POST"
           });
       }
       return NextResponse.json(resData);
   } catch (error)
   {
       console.error(error);
       return NextResponse.json({hasErrors:true, message:"Failed to save website settings. Check error logs"});
   }
}
