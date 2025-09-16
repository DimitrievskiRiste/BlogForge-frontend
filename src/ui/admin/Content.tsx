"use client";
import React from "react";

type TemplateBodyProps = {
    children:React.ReactElement
}
export default function TemplateBody({children}:TemplateBodyProps)
{
    return (
        <>
            <div className="flex flex-col flex-wrap space-y-1 mt-[6em] md:ml-[5em] w-[90%]">
                {children}
            </div>
        </>
    )
}
