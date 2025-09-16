"use client";
import React, {memo, useContext, useState} from "react";
import Image from "next/image";
import {MenuOutline} from "@/ui/icons";
import {AppContext} from "@/contexts/App";


const Navbar = memo(function Navbar(){
    const data = useContext(AppContext);
    const [mime] = useState<null | string | undefined>(data?.image?.mime_type);
    const [logo] = useState<null | string | undefined>(data?.image?.blob);
    const [websiteName] = useState<null | string | undefined>(data?.setting?.website_name);
    return (
        <>
            <div className="p-header items-center content-center space-x-1 p-4">
                <div className="menu-container flex items-center space-x-1">
                    <MenuOutline style={{fontSize:"25px", color:"#fff"}}/>
                </div>
                <div className="logo-icon">
                    <div className="logo-container">
                        <Image src={`data:${mime};base64,${logo}`} alt={`${websiteName}'s logo`}
                               width={100}
                               height={100}/>
                    </div>
                </div>
                <div className="search-container flex flex-2 items-center justify-center">
                    <div className="search-ui-input">
                        <input type="search" className="border-none w-[50%] focus:outline-none" placeholder="Search anything..."/>
                        <select className="search-criteria-ui w-[50%]">
                            <option value="post">posts</option>
                            <option value="members">members</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
});
export default Navbar;
