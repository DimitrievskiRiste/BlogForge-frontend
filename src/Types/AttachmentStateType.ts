export type AllowedAttachmentKeys = "attachment_name"|"src"|"mime"|"isUploading"|"uploadPercent";

export type AttachmentStateType = {
    [key in AllowedAttachmentKeys]:string|boolean|undefined|null|number|ArrayBuffer;
}
export type AttachmentData = {
    success?:boolean
    attachment:AttachmentObject
}
export type AttachmentObject = {
    attachment_id:number,
    name:string
    blob:string
    mime:string
}
