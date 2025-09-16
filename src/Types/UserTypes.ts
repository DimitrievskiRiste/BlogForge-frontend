export type UserGroup = {
    group_id:number;
    group_name:string;
    group_title:string;
    can_access_admincp:boolean;
    can_access_users:boolean;
    can_add_users:boolean;
    can_remove_users:boolean;
    can_access_categories:boolean;
    can_add_categories:boolean;
    can_remove_categories:boolean;
    can_edit_categories:boolean;
    can_access_articles:boolean;
    can_add_article:boolean;
    can_remove_article:boolean;
    can_edit_article:boolean;
    can_comment:boolean;
    can_delete_comments:boolean;
    can_delete_self_comment:boolean;
    can_edit_self_comment:boolean;
    can_change_settings:boolean;
    can_manage_admins:boolean;
    can_upload_attachments:boolean;
    can_remove_self_attachments:boolean;
    can_remove_attachments:boolean;
    can_add_groups:boolean;
    can_edit_groups:boolean;
    can_remove_groups:boolean;
}
export type UserData = {
    name:string|null;
    last_name:string|null;
    group:UserGroup|null;
} | null
