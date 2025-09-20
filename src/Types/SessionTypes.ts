type AllowedCookieSettings = "Strict" | "Lax" | "None";
type SameSiteOptions = Partial<Record<AllowedCookieSettings, string>>
export type SessionOption = {
    expires:Date
    sameSite:SameSiteOptions
    path:string
    httpOnly:boolean
}
