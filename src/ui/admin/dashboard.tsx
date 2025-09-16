"use client";
import {useState} from "react";
import BlogForge from "@/ui/App";
import {AppContext, SettingData, UserContext} from "@/contexts/App";
import {UserData} from "@/Types/UserTypes";
import Navbar from "@/ui/admin/navbar/navbar";
import TemplateBody from "@/ui/admin/Content";
import Link from "next/link";
import Statistics from "@/ui/admin/widgets/Statistics";

type DashboardPageType = {
    setting:SettingData,
    user:UserData,
}
export default function Dashboard({setting, user}:DashboardPageType)
{
    const [appSetting, setAppSetting] = useState(setting);
    const [userData, setUserData] = useState(user);
    return (
        <>
            <BlogForge>
                <AppContext value={appSetting}>
                    <UserContext value={userData}>
                        <Navbar/>
                        <TemplateBody>
                            <>
                                <div className="flex flex-row w-full flex-wrap space-x-1 items-start">
                                    <Link href="/admin" title="Admin panel">Home</Link>
                                    <span className="divider"></span>
                                </div>
                                <h1>{appSetting.website_name} Admin Panel</h1>
                                <div className="flex flex-row space-x-1 space-y-1 w-full flex-wrap">
                                    <Statistics headline="Registered Members" value={0}/>
                                    <Statistics headline="Total Blogs" value={0}/>
                                    <Statistics headline="Total Comments" value={0}/>
                                </div>
                            </>
                        </TemplateBody>
                    </UserContext>
                </AppContext>
            </BlogForge>
        </>
    )
}
