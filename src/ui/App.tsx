"use client";
import React from "react";
import {HeroUIProvider} from "@heroui/react";

type AppProps = {
    children:React.ReactElement
}
const BlogForge = ({children}:AppProps) => {
    return (
        <>
            <HeroUIProvider>
                <div className="flex flex-col flex-wrap space-y-1 pageBody content-start min-h-screen">
                    {children}
                </div>
            </HeroUIProvider>
        </>
    )
}
export default BlogForge;
