export type AllowedSettingFormType = "website_name" | "registration_enabled" | "verify_email_address" | "registration_min_age" | "website_logo";
export type SettingsFormType = Partial<Record<AllowedSettingFormType, string | number | null | Blob | boolean>>
