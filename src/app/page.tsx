"use server";
import BlogForge from "@/ui/App";
import {Suspense} from "react";
import ContentLoading from "@/ui/ContentLoading";
import {getAppSettings, ResponseData} from "@/server";
import {Metadata} from "next";
import {Homepage} from "@/ui/homepage";
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
export default async function Home() {
    return (
        <BlogForge>
            <Suspense fallback={<ContentLoading/>}>
                <HomepageWrapper/>
            </Suspense>
        </BlogForge>
    );
}
async function HomepageWrapper() {
    const settings= await getAppSettings();
    return (
        <>
            <Homepage appData={settings}/>;
        </>
    )
}

