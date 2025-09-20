import {cache} from "react";
import {Metadata} from "next";
export type ImageData = {
    mime_type:string
    blob:string
}
export type SettingData = {
    id:number
    website_name:string
    registration_enabled:boolean
    verify_email_address:boolean
    registration_min_age:number
    website_logo?:number
    tos_text?:string
    privacy_text?:string
}
export type ResponseData = {
    setting?:SettingData
    image?:ImageData
    hasErrors?:boolean
    message?:string
}

/**
 * Change API url on line 5 with your correct URL to the backend API URL.
 */
const getApiServerUrl = () :string => {
    return "http://localhost/blogforge/public/index.php/api"
}
export default getApiServerUrl();
export const getAppSettings = cache(async () => {
    try {
        const res = await fetch(getApiServerUrl() + "/settings/", {
            headers: { "Cache-Control": "public, max-age=3600, must-understand, stale-if-error" },
        });
        const data :ResponseData = await res.json();
        return data;
    } catch(e){
        console.error(e);
        return null;
    }
});
export async function generateMeta(customTitle?:string) :Promise<Metadata>{
    const data :ResponseData|null = await getAppSettings();
    if(data && !data.hasErrors) {
        return {
            title: data?.setting?.website_name + ` ${customTitle}`,
            openGraph: {
                title: data.setting?.website_name + ` ${customTitle}`,
                images: [
                    {
                        url: `data:${data.image?.mime_type};base64,${data.image?.blob}`,
                        alt: data?.setting?.website_name
                    }
                ]
            }
        }
    } else {
        return {
            title:"Next app"
        }
    }
}
