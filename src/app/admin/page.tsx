"use server";

import {Metadata} from "next";
import {generateMeta, getAppSettings} from "@/server";
import {cookies} from "next/headers";
import {Suspense} from "react";
import ContentLoading from "@/ui/ContentLoading";
import Dashboard from "@/ui/admin/dashboard";
import {UserData} from "@/Types/UserTypes";
export async function generateMetadata():Promise<Metadata> {
    return await generateMeta('Admin Panel');
}
export default async function AdminPanel()
{
    const c = await cookies();
    type CookieUser = {
        isAuthenticated:boolean;
        user:UserData
    }
    const user = JSON.parse(c.get('user')?.value);
    return (
        <>
                <Suspense fallback={<ContentLoading/>} name="AdminAppSettings">
                    <AppSettingsWrapper user={user.user}/>
                </Suspense>
        </>
    )
}
type WrapperType = {
    user:UserData
    children:React.ReactNode
}
async function AppSettingsWrapper({user,children}:WrapperType)
{
    const app = await getAppSettings();
    return (
        <>
          <Dashboard setting={app} user={user}/>
        </>
    )
}
