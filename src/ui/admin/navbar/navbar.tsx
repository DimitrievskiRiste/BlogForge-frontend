"use client";
import {useContext} from "react";
import {AppContext, UserContext} from "@/contexts/App";
import {
    BaselineGroups, BaselineSettings,
    Blog,
    Categories,
    HomeOutlined,
    MenuOutline,
    SearchLarge,
    UserSettingsOutline,
    WelcomeWriteBlog
} from "@/ui/icons";
import Image from "next/image";
import {Tooltip} from "@heroui/react";
import Link from "next/link";

export default function Navbar()
{
    const user = useContext(UserContext);
    const app = useContext(AppContext);
    const showLogoIfAny = app?.image ? (
        <>
            <Image src={`data:${app.image?.mime_type};base64,${app?.image?.blob}`} width={100} height={100} alt={`${app.setting?.website_name}'s logo`}/>
        </>
    ) : null
    return (
        <>
            <header className="fixed top-0 ui-block w-full z-[20] p-5 flex flex-col flex-wrap shadow-sm">
                <nav className="flex flex-row w-full items-center flex-wrap space-y-1">
                    <div className="cursor-pointer w-[30px] h-[30px]">
                        <MenuOutline className="h-full w-full"/>
                    </div>
                    <div className="flex flex-row max-w-[140px] max-h-[50px]">
                        {showLogoIfAny}
                    </div>
                    <div className="cursor-pointer w-[30px] h-[30px]">
                        <SearchLarge className="w-[30px] h-[30px]"/>
                    </div>
                </nav>
            </header>
            <aside className="ui-block w-[70px] shadow-sm hidden md:flex flex-col flex-wrap fixed top-[6em] left-0 h-full">
                <Link href="/admin" className="flex flex-col w-full relative z-[2] items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Home page" placement="right-end">
                        <HomeOutlined width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/create_blog" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Create new Blog" placement="right-end">
                        <WelcomeWriteBlog width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/blogs" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="List of blogs" placement="right-end">
                        <Blog width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/blog_categories" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Manage Blog categories" placement="right-end">
                        <Categories width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/groups" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Manage User groups" placement="right-end">
                        <BaselineGroups width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/users" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Manage users" placement="right-end">
                        <UserSettingsOutline width="30px" height="30px"/>
                    </Tooltip>
                </Link>
                <Link href="/admin/settings" className="flex flex-col w-full relative items-center border-solid border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200">
                    <Tooltip content="Manage website settings" placement="right-end">
                        <BaselineSettings width="30px" height="30px"/>
                    </Tooltip>
                </Link>
            </aside>
        </>
    )
}
