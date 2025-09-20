"use server";

import {Metadata} from "next";
import {generateMeta, getAppSettings} from "@/server";
import {cookies} from "next/headers";
import {Suspense} from "react";
import Dashboard from "@/ui/admin/dashboard";
import {UserData} from "@/Types/UserTypes";
import {PageLoading} from "@/ui/admin/PageLoading";
export async function generateMetadata():Promise<Metadata> {
    return await generateMeta('Admin Panel');
}
export default async function AdminPanel()
{
    const c = await cookies();
    const userData = c.get("user")?.value ?? null
    const user = userData ? JSON.parse(userData) : null;
    return (
        <>
                <Suspense fallback={<PageLoading/>} name="AdminAppSettings">
                    <AppSettingsWrapper user={user.user}/>
                </Suspense>
        </>
    )
}
type WrapperType = {
    user:UserData|null
}
async function AppSettingsWrapper({user}:WrapperType)
{
    const app = await getAppSettings() ?? null;
    return (
        <>
          <Dashboard setting={app} user={user}/>
        </>
    )
}
