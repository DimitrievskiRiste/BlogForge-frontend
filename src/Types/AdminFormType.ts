export type AllowedAdminTypes = "name" | "email" | "password" | "birth_date" | "last_name" | "token_password";
export type AdminFormType = Partial<Record<AllowedAdminTypes, string | null>>
