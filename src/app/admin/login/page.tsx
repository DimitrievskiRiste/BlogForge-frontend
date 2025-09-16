"use server";
import BlogForge from "@/ui/App";
import {AdminLogin, LoadingMessage} from "@/ui/admin/Login";
import getApiServerUrl, {getAppSettings, ResponseData} from "@/server";
import {Suspense} from "react";
import {UserData} from "@/Types/UserTypes";
import {Metadata} from "next";
export async function generateMetadata() :Promise<Metadata>{
    const data :ResponseData = await getAppSettings();
    if(data && !data.hasErrors){
        return {
            title:data?.setting?.website_name,
            openGraph:{
                title:data.setting?.website_name,
                images:[
                    {
                        url:`data:${data.image?.mime_type};base64,${data.image?.blob}`,
                        alt:data?.setting?.website_name
                    }
                ]
            }
        }
    }
}
export default async function AdminCPLogin()
{
    return (
        <BlogForge>
            <Suspense fallback={<LoadingMessage/>}>
                <RenderTemplateWrapper/>
            </Suspense>
        </BlogForge>
    )
}
function RenderTemplateWrapper()
{
    return <RenderTemplate/>
}
export async function RenderTemplate()
{
    const data = await fetch(getApiServerUrl+"/verify");
    switch(data.status)
    {
        case 403: {
            return (
                <>
                    <AdminLogin/>
                </>
            )
        }
        default:{
            type ResponseData = {
                isAuthenticated: boolean;
                user: UserData;
            }
            const response :ResponseData = await data.json();
            if(response.user.group.can_access_admincp)
            {

            } else {
                return <AdminLogin/>
            }
        }
    }
}
