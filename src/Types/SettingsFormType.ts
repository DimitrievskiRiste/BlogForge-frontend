
export type AllowedSettingFormType = "website_name" | "registration_enabled" | "verify_email_address" | "registration_min_age" | "website_logo";
export type SettingsFormType = Partial<Record<AllowedSettingFormType, string | number | null | Blob | boolean>>
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
export type ImageData = {
    mime_type:string
    blob:string
}
