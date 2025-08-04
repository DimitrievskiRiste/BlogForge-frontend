export type AllowedAttachmentKeys = "attachment_name"|"src"|"mime"|"isUploading"|"uploadPercent";

export type AttachmentStateType = {
    [key in AllowedAttachmentKeys]:string|boolean|undefined|null|number|ArrayBuffer;
}
