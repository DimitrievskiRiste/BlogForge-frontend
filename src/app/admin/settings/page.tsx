"use server";
import {Suspense} from "react";
import {generateMeta, getAppSettings} from "@/server";
import {cookies} from "next/headers";
import {UserData} from "@/Types/UserTypes";
import SettingsComponent from "@/ui/admin/settings";
import {PageLoading} from "@/ui/admin/PageLoading";

export async function generateMetadata()
{
    const meta = await generateMeta('Admin Panel');
    return meta;
}
export default async function AdminSetting()
{
    const c = await cookies();
    const userData = c.get("user")?.value ?? null;
    const user = userData ? JSON.parse(userData) : null;
    return (
        <>
            <Suspense fallback={<PageLoading/>} name={"AdminSetting page"}>
                <ContentWrapper user={user.user}/>
            </Suspense>
        </>
    )
}
type ContentType = {
    user:UserData
}
async function ContentWrapper({user}:ContentType)
{
    const app = await getAppSettings();
    return (
        <>
            <SettingsComponent app={app} user={user}/>
        </>
    )
}
