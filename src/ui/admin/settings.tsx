'use client';
import React, {useCallback, useEffect, useState} from "react";
import {ResponseData} from "@/Types/SettingsFormType";
import {UserData} from "@/Types/UserTypes";
import {AppContext, UserContext} from "@/contexts/App";
import BlogForge from "@/ui/App";
import Navbar from "@/ui/admin/navbar/navbar";
import TemplateBody from "@/ui/admin/Content";
import Link from "next/link";
import Footer from "@/ui/footer";
import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {CircularProgress, Switch} from "@heroui/react";
import Image from "next/image";
import axios from "axios";
import {AttachmentData} from "@/Types/AttachmentStateType";
import {Button} from "@heroui/button";
import {LoadingProp} from "@/Types/LoadingProp";
type SettingComponentType = {
    app:ResponseData
    user:UserData
}
export default function SettingsComponent({app, user}:SettingComponentType)
{
    type FormErrorsType = {
        website_name:null|string
        registration_enabled:null|string
        registration_min_age:null|string
        image:null|string
    }
    type Attachment = {
        isUploading:boolean
        percentage:number
        mimeType:string|null
        src:string|null|ArrayBuffer
    }
    const [attachment, setAttachment] = useState<Attachment>({
        isUploading:false,
        percentage:0,
        mimeType:null,
        src:null
    });
    const [setting, setSetting] = useState<ResponseData>(app);
    const [userData] = useState<UserData>(user);
    const [formErrors, setFormErrors] = useState<FormErrorsType>({
        website_name:null,
        registration_enabled:null,
        registration_min_age:null,
        image:null
    });
    const [isLoading, setIsLoading] = useState<LoadingProp>(false);
    const [regLabel, setRegLabel] = useState(setting?.setting?.registration_enabled ? "New Registrations enabled" : "New Registrations disabled");
    const [emailVerifyLabel, setEmailVerifyLabel] = useState(setting?.setting?.verify_email_address ? "Email verifications enabled" : "Email verification disabled");
    function setRegistrationEnabled()
    {
        setSetting((prev) => ({...(prev ?? {}), setting:{...(prev?.setting ?? {}), registration_enabled:!prev?.setting?.registration_enabled}}));

    }
    function setEmailVerification()
    {
        setSetting((prev) => ({
            ...(prev ?? {}),
            setting:{
                ...(prev?.setting ?? {}),
                verify_email_address:!prev?.setting?.verify_email_address
            }
        }));
    }
    const updateEmailLabFn = useCallback(() => {
        setEmailVerifyLabel(setting?.setting?.verify_email_address ? "Email verifications enabled" : "Email verification disabled!");
    },[setting?.setting?.verify_email_address]);
    const updateRegLabelFn = useCallback(() => {
        setRegLabel(setting?.setting?.registration_enabled ? "New Registrations enabled" :" New Registrations disabled");
    },[setting?.setting?.registration_enabled]);
    useEffect(() => {
        updateEmailLabFn();
        updateRegLabelFn();
    }, [updateEmailLabFn, updateRegLabelFn]);
    const regEnablled = setting?.setting?.registration_enabled ? (
        <>
            <span aria-labelledby="regEnabled">Registrations are allowed by default. By clicking on the button above will disable new registrations.</span>
        </>
    ) : (
        <>
            <span aria-labelledby="regEnabled">Registrations are turned off. To turn on, please click on the switch button above.</span>
        </>
    );
    const verifyEmail = setting?.setting?.verify_email_address ? (
        <>
            <span aria-labelledby="verifyEmail">Email verifications is enabled and any new registrations will need to be verified.</span>
        </>
    ) : (
        <>
            <span aria-labelledby="veriyEmail">Email verification is disabled.</span>
        </>
    )
    function setInputVal(e:React.ChangeEvent<HTMLInputElement>){
        const target = e.target, type = target.type, name = target.name,
            value = target.value;
        switch(type)
        {
            case 'text':
                if(/^[a-zA-Z0-9!#$%^&*\s]+$/.test(value)) {
                    setFormErrors((prev) => ({...prev, [name]:null}));
                    setSetting((prev) => ({
                        ...prev,
                        setting: {
                            ...prev?.setting,
                            [name]:value
                        }
                    }));
                } else {
                    setFormErrors((prev) => ({...prev, [name]:"This field has invalid data!"}));
                }
                return;
            case 'number':
                if(/^[0-9.]+$/.test(value)){
                    setFormErrors((prev) => ({...prev, [name]:null}));
                    setSetting((prev) => ({
                        ...prev,
                        setting:{
                            ...prev?.setting,
                            [name]:Number(value)
                        }
                    }));
                } else {
                    setFormErrors((prev) => ({...prev, [name]:"This field must be numeric!"}));
                }
                return;
        }
    }
    const uploadLogo = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target, files = target.files, file = files ? files[0] : null;
        if(file)
        {
            switch(file.type)
            {
                case "image/png":
                case "image/jpeg":
                case "image/jpg":
                    const fr = new FileReader();
                    const f = new FormData();
                    f.set('file', file);
                    fr.onload = () => {
                        const result = fr.result;
                        setAttachment((prev) => ({...prev, mimeType:file.type, src:result, isUploading:true, percentage:0}));
                    }
                    fr.readAsDataURL(file);
                    const res = await axios.post("/api/attachments", f, {
                       onUploadProgress:(e) => {
                           if(e.lengthComputable) {
                               const total = e?.total ?? file.size;
                               const percentages = Math.round((e.loaded * 100) / total);
                               setAttachment((prev) => ({...prev, percentage:percentages}));
                           }
                       }
                    });
                    switch(res.status){
                        case 200: {
                            const response :AttachmentData = res.data;
                            if(response.success) {
                                setAttachment((prev) => ({...prev, isUploading:false}));
                                const img = {
                                    mimeType:response.attachment.mime,
                                    blob:response.attachment.blob
                                }
                                setSetting((prev) => ({...(prev ?? {}), setting:{...(prev ?? {}), website_logo:response.attachment.attachment_id}}))
                                setSetting((prev) => ({
                                    ...prev,
                                    image:img
                                }));
                            }
                        }
                    }
                    return;
                default:
                    setFormErrors((prev) => ({...prev, image:`The image ${file.type} is not supported.`}));
                    return;
            }
        }
    }
    const removeLogo = () => {
        setSetting((prev) => ({
            ...prev,
            image:null
        }));
    }
    const showUploadingAttachment = attachment && attachment.isUploading ? (
        <>
            <div className="flex relative w-[200px] h-[200px] flex-col space-y-1 flex-wrap">
                <div className="flex relative w-full items-end flex-row">
                    <span className="cursor-pointer">X</span>
                </div>
                <div className="absolute w-full h-full drop-shadow-md z-[20]">
                    <CircularProgress aria-label={`${attachment.percentage}%`}
                                      showValueLabel={true}
                                      color="warning"
                                      size="lg"
                                      value={attachment.percentage}
                                      maxValue={100}/>
                </div>
                <Image src={`data:${attachment.mimeType};${attachment.src}`} alt={`${setting?.setting?.website_name}'s logo`} width={100} height={100} className=" absolute !w-full !h-full"/>
            </div>
        </>
    ) : null;
    const submitForm = async () => {
        if(!setting?.setting?.website_name) {
            setFormErrors((prev) => ({...prev, website_name:"Website name can't be empty!"}));
            return;
        }

    }
    return (
        <>
                    <BlogForge>
                        <AppContext.Provider value={setting}>
                            <UserContext.Provider value={userData}>
                                <Navbar/>
                                <TemplateBody>
                                    <>
                                        <div className="flex flex-row flex-wrap space-x-2 w-full items-start">
                                            <Link href="/admin" title="Admin Panel Home">Home</Link>
                                            <div className="divider"></div>
                                            <Link href="/admin/settings" title="Website settings">Settings</Link>
                                        </div>
                                        <h1 className="page-title">{setting?.setting?.website_name} Admin Panel</h1>
                                        <div className="flex w-full flex-col justify-center flex-wrap items-center">
                                            <div className="ui-block p-5 flex w-[80%] md:w-[50%] flex-col space-y-1 flex-wrap">
                                                <h2 className="text-center">{setting?.setting?.website_name}&apos;s Settings</h2>
                                                <Form className="flex flex-col w-full flex-wrap items-start space-y-2">
                                                    <Input type="text" label="Website name" isRequired={true} isInvalid={!!formErrors.website_name} errorMessage={formErrors?.website_name} name="website_name" defaultValue={setting?.setting?.website_name ?? ''} onChange={setInputVal}/>
                                                    <Input type="number" name="registration_min_age" isRequired={true} isInvalid={!!formErrors.registration_min_age} errorMessage={formErrors?.registration_min_age} onChange={setInputVal} label="Registration min age" defaultValue={setting?.setting?.registration_min_age?.toString()}/>
                                                    <Switch id="regEnabled" isSelected={setting?.setting?.registration_enabled} onValueChange={setRegistrationEnabled}>{regLabel}</Switch>
                                                    {regEnablled}
                                                    <Switch id="verifyEmail" isSelected={setting?.setting?.verify_email_address} onValueChange={setEmailVerification}>{emailVerifyLabel}</Switch>
                                                    {verifyEmail}
                                                    <Input type="file" name="website_logo" label="Upload logo" isInvalid={!!formErrors.image} errorMessage={formErrors?.image} onChange={uploadLogo}/>
                                                    <div className="flex flex-col border-b-2  border-neutral-100 border-solid space-y-1 w-full">
                                                        <span>Attachments</span>
                                                        <div className="flex flex-row space-x-1 space-y-1 flex-wrap items-start">
                                                            {setting?.image ? (
                                                                <>
                                                                    <div className="border-2 flex flex-col border-solid border-neutral-100 w-[200px]">
                                                                        <div className="flex flex-row justify-end w-full">
                                                                            <span className="cursor-pointer" onClick={removeLogo}>X</span>
                                                                        </div>
                                                                        <Image src={`data:${setting?.image?.mime_type};base64,${setting?.image?.blob}`} width={200} height={200} alt={setting?.setting?.website_name ?? ''}/>
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                            {showUploadingAttachment}
                                                        </div>
                                                    </div>
                                                    <div className="flex relative w-full justify-center">
                                                        <Button color="primary" disabled={isLoading} isLoading={isLoading} onClick={submitForm}>Save Changes</Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                        <Footer/>
                                    </>
                                </TemplateBody>
                            </UserContext.Provider>
                        </AppContext.Provider>
                    </BlogForge>
        </>
    )
}
