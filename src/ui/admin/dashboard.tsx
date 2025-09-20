"use client";
import {useState} from "react";
import BlogForge from "@/ui/App";
import {AppContext, SettingData, UserContext} from "@/contexts/App";
import {UserData} from "@/Types/UserTypes";
import Navbar from "@/ui/admin/navbar/navbar";
import TemplateBody from "@/ui/admin/Content";
import Link from "next/link";
import Statistics from "@/ui/admin/widgets/Statistics";
import {ResponseData} from "@/Types/SettingsFormType";

type DashboardPageType = {
    setting:ResponseData,
    user:UserData,
}
export default function Dashboard({setting, user}:DashboardPageType)
{
    const [appSetting, setAppSetting] = useState<ResponseData>(setting);
    const [userData, setUserData] = useState<UserData>(user);
    return (
        <>
            <BlogForge>
                <AppContext.Provider value={appSetting}>
                    <UserContext.Provider value={userData}>
                        <Navbar/>
                        <TemplateBody>
                            <>
                                <div className="flex flex-row w-full flex-wrap space-x-2">
                                    <Link href="/admin" title="Admin panel">Home</Link>
                                    <span className="divider"></span>
                                </div>
                                <h1>{appSetting?.setting?.website_name} Admin Panel</h1>
                                <div className="flex flex-row space-x-1 space-y-1 w-full flex-wrap">
                                    <Statistics headline="Registered Members" value={0}/>
                                    <Statistics headline="Total Blogs" value={0}/>
                                    <Statistics headline="Total Comments" value={0}/>
                                </div>
                            </>
                        </TemplateBody>
                    </UserContext.Provider>
                </AppContext.Provider>
            </BlogForge>
        </>
    )
}
