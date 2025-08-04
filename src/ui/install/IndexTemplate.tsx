"use client";
import {memo, useState} from "react";
import {Card} from "@heroui/card";
import {Button} from "@heroui/button";
import {Input, Textarea} from "@heroui/input";
import React from "react";
import {DBConnection} from "@/Types/DBConnection";
import {DBTables} from "@/Types/DBTables";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/modal";
import {DBDropType} from "@/Types/DBDropType";
import {Form} from "@heroui/form";
import {AllowedTypes, DBFormData} from "@/Types/DBFormData";
import {AdminFormType, AllowedAdminTypes} from "@/Types/AdminFormType";
import {AllowedSettingFormType, SettingsFormType} from "@/Types/SettingsFormType";
import {AllowedValidationType} from "@/Types/ValidationType";
import {CircularProgress, Switch} from "@heroui/react";
import {AttachmentStateType} from "@/Types/AttachmentStateType";
import axios from "axios";
import Image from "next/image";


/**
 * To do list:
 *  - Admin account creation
 *  - Website setting prompt (like website name, etc)
 *  - Complete the installation & Lock the install.
 * @constructor
 */


export default memo(function IndexTemplate()
{
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [headingText, setHeading] = useState("Welcome to the BlogForge v1.0");
    const [isInstalling, setIsInstalling] = useState(false);
    const [installStatus, setInstallStatus] = useState<string[]>([]);
    const [isRemoving, setIsRemoving] = useState(false);
    const [dbTables, setDbTables] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [attachment, setAttachment] = useState<AttachmentStateType>({
        attachment_name:null,
        isUploading:false,
        uploadPercent:0,
        mime:null,
        src:null
    });
    const [dbData, setDbData] = useState<DBFormData>({
       dbhost:'',
       dbname:'',
       dbuser:'',
       dbpass:'',
       dbport:'3306'
    });
    const [adminData, setAdminData] = useState<AdminFormType>({
        name:'',
        email:'',
        token_password:'',
        last_name:'',
        birth_date:'',
        password:''
    });
    const [adminFormErrors, setAdminFormErrors] = useState<AdminFormType>({
       name:null,
       email:null,
       token_password:null,
       last_name:null,
       birth_date:null,
       password:null
    });
    const [settingsData, setSettingsData] = useState<SettingsFormType>({
        website_name:null,
        website_logo:null,
        registration_enabled:true,
        registration_min_age:18,
        verify_email_address:true
    });
    const [settingErrors, setSettingErrors] = useState<SettingsFormType>({
        website_logo:null,
        website_name:null,
        registration_enabled:null,
        registration_min_age:null,
        verify_email_address:null
    });
    type Connection = {
        data:DBConnection
    }
    type ResponseTableType = {
        data:DBTables
    }
    const onClickEvent = async () =>  {
        setIsLoading(true);
        setHeading("Checking DB Connection...");
        setInstallStatus((prev) => [...prev, "Checking database connection."]);
        setIsInstalling(true);
        const dbCheck = await fetch("/api/db/connection");
        const response :Connection  = await dbCheck.json();
        if(response.data.hasErrors) {
            setIsLoading(false);
            setHeading("Checking Environment DB settings...");
            setInstallStatus((prev) => [...prev, response.data.message]);
            setStep(2);
        }
        if(response.data.success){
            setStep(3);
            setInstallStatus((prev) => [...prev, "Skipping step environment checking, DB connection is successfully validated."]);
            setHeading("Checking Database for Tables...")
            const dbTables = await fetch("/api/db/tables");
            const response :ResponseTableType = await dbTables.json();
            if(response.data.hasErrors && response.data.has_tables && response.data.tables)
            {
                setInstallStatus((prev) => [...prev, "Database is not empty, prompting for removal..."]);
                const tables = response.data.tables;
                for(let i = 0; i < tables.length; i++ ){
                    setDbTables((prev) => [...prev, tables[i]]);
                }
            } else {
                await CreateTables();
            }
        }
    }
    const RemoveTables = async () => {
        setIsRemoving(true);
        const response = await fetch("/api/db/tables/drop");
        const data :DBDropType = await response.json();
        if(data.hasErrors) {
            setHeading("Installation aborted");
            setInstallStatus((prev) => [...prev, data.message]);
        }
        if(data.success){
            setIsRemoving(false);
            setInstallStatus((prev) => [...prev, data.message]);
            await CreateTables();
        }
    }
    const CreateTables = async () => {
        setStep(4);
        setHeading("Creating database tables...");
        setInstallStatus((prev) => [...prev, "Creating database tables..."]);
        const response = await fetch("/api/db/tables/create", {method:"POST"});
        const data :DBDropType = await response.json();
        if(data.hasErrors) {
            setHeading("Installation aborted!");
            setInstallStatus((prev) => [...prev, data.message]);
        }
        if(data.success){
            setStep(5);
            setHeading("Creating default user groups...");
            setInstallStatus((prev) => [...prev, "Creating default user groups..."]);
            const response = await fetch("/api/db/migrations/groups",{method:"POST"});
            const data :DBConnection = await response.json();
            if(data.hasErrors){
                setHeading("Installation aborted!");
                setInstallStatus((prev) => [...prev, data.message]);
            }
            if(data.success){
                setStep(6);
                setHeading("Admin Account");
                setIsLoading(false);
                setInstallStatus((prev) => [...prev, "Creating admin account"]);
            }
        }
    }
    const ValidateAndSend = async () => {
        const form = new FormData();
        (Object.entries(dbData) as [AllowedTypes, string | number | null | undefined][]).forEach(
            ([key, value]) => {
                if (value != null) { // filters out null and undefined
                    form.set(key, String(value)); // safely convert to string
                }
            }
        );
        const response = await fetch("/api/db/environment/add",{
            method:"POST",
            body:form
        });
        const data :DBConnection = await response.json();
        if(data.hasErrors) {
            setHeading("Installation aborted");
            setInstallStatus((prev) => [...prev, data.message]);
        }
        if(data.success) {
            setInstallStatus((prev) => [...prev, data.message]);
            // lets check for table existence
            const dbTables = await fetch("/api/db/tables");
            const response :ResponseTableType = await dbTables.json();
            if(response.data.hasErrors && response.data.has_tables && response.data.tables)
            {
                setIsInstalling(true);
                setStep(3);
                setHeading("Database not empty.");
                setInstallStatus((prev) => [...prev, "Database is not empty, prompting for removal..."]);
                const tables = response.data.tables;
                for(let i = 0; i < tables.length; i++ ){
                    setDbTables((prev) => [...prev, tables[i]]);
                }
            } else {
                await CreateTables();
            }
        }
    }

    const ValidateTextInput   = (name:AllowedTypes, value:string) :true|null|undefined|string => {
        if(/^[a-zA-Z.0-9#!@%^&()_-]+$/.test(value)){
            setDbData((prev) => ({...prev, [name]:value}));
            return null;
        }
        return "Invalid characters";
    }
    const SetData = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {type, value, name} = e.target;
        switch(type)
        {
            case 'email':
                if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())){
                    setAdminFormErrors((prev) => ({...prev, email:null}));
                    setAdminData((prev) => ({...prev, email:value}));
                } else {
                    setAdminData((prev) => ({...prev, email:null}));
                    setAdminFormErrors((prev) => ({...prev, email:"Invalid email format!"}));
                }
                return;
            case 'text':
                if(/^(?=.*[a-zA-Z])[a-zA-Z\s]+$/.test(value)){
                    console.log("Input validated");
                    setAdminFormErrors((prev) => ({...prev, [name]:null}));
                    setAdminData((prev) => ({...prev, [name]:value}));
                } else {
                    console.log("invalid field");
                    setAdminFormErrors((prev) => ({...prev, [name]:`This field has invalid attributes!`}));
                }
                return;
            case 'password':
                setAdminData((prev) => ({...prev, [name]:value}));
                return;
            case 'date':
                setAdminData((prev) => ({...prev, [name]:value}));
                return;
        }
    }
    const onSubmitForm = async () => {
        setIsLoading(true);
        const form = new FormData();
        (Object.entries(adminData) as [AllowedAdminTypes, string | null][]).forEach(([key, value]) => {
                form.set(key, String(value));
        });
        const response = await fetch("/api/db/migrations/user", {
            method:"POST",
            body:form
        });
        const data :DBConnection = await response.json();
        if(data.hasErrors) {
            setHeading("Installation failed");
            setIsLoading(false);
            setInstallStatus((prev) => [...prev,"Failed to create admin account"]);
        }
        if(data.success){
            setHeading("Creating default website settings");
            setIsLoading(false);
            setInstallStatus((prev) => [...prev, "Successfully created admin account"]);
            setInstallStatus((prev) => [...prev, "Creating default website settings"]);
            setStep(7);
        }
    }
    const showAdminForm =  isInstalling && step === 6 ? (
        <>
            <Modal isOpen={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Admin account details</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Input isRequired
                                   type="text"
                                   name="name"
                                   label="Your name"
                                   labelPlacement="inside"
                                   onChange={SetData}
                                   isInvalid={!!adminFormErrors.name}
                                   errorMessage={adminFormErrors?.name}
                            />
                            <Input isRequired
                                   type="text"
                                   name="last_name"
                                   label="Last name"
                                   labelPlacement="inside"
                                   onChange={SetData}
                                   isInvalid={!!adminFormErrors.last_name}
                                   errorMessage={adminFormErrors?.last_name}/>
                            <Input isRequired
                                   type="email"
                                   name="email"
                                   label="Email address"
                                   labelPlacement="inside"
                                   onChange={SetData}
                                   isInvalid={!! adminFormErrors.email}
                                   errorMessage={adminFormErrors?.email}/>
                            <Input isRequired
                                   type="password"
                                   name="password"
                                   label="Account password"
                                   labelPlacement="inside"
                                   onChange={SetData}
                                   errorMessage={adminFormErrors?.password}/>
                            <Input isRequired
                                   type="password"
                                   name="token_password"
                                   label="Account PIN code"
                                   labelPlacement="inside"
                                   onChange={SetData}
                                   errorMessage={adminFormErrors?.token_password}/>
                            <Input    name="birth_date"
                                       label="Birth date"
                                       isRequired
                                       type="date"
                                       labelPlacement="inside"
                                       onChange={SetData}
                                       errorMessage={adminFormErrors?.birth_date}/>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex w-[100%] flex-wrap justify-center">
                            <Button type="submit" onPress={onSubmitForm} className="bg-primary" isLoading={isLoading}>
                                <span className="text-white">Save changes</span>
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    ) : null;
    const promptForDBDetails = isInstalling && step === 2 ? (
        <>
            <Modal isOpen={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Database Details</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Input label="Database host"
                                   isRequired
                                   labelPlacement="inside"
                                   name="dbhost"
                                   description="By default the database host is localhost, if unsure please contact your hosting provider."
                                   validate={(value:string) => {
                                       if(value.length > 0){
                                           return null;
                                       } else {
                                           return "This field is required";
                                       }
                                   }}
                                   onChange={(e) => {
                                       const {value} = e.target;
                                       ValidateTextInput('dbhost', value);
                                   }}
                            />
                            <Input label="Database name"
                                   isRequired
                                   labelPlacement="inside"
                                   name="dbname"
                                   description = "Enter database name in the field above. Make sure it's valid."
                                   validate={(value:string) => {
                                       if(value.length > 0) {
                                           return null;
                                       } else {
                                           return "This field is required !";
                                       }
                                   }}
                                   onChange={(e) => {
                                       const {value} = e.target;
                                       ValidateTextInput('dbname', value);
                                   }}
                            />
                            <Input label="Database user"
                                   isRequired
                                   labelPlacement="inside"
                                   name="dbuser"
                                   description="Database user associated with the database name!"
                                   validate={(value:string) => {
                                       if(value.length > 0){
                                           return null;
                                       } else {
                                           return "This field is required";
                                       }
                                   }}
                                   onChange={(e) => {
                                       const {value} = e.target;
                                       ValidateTextInput("dbuser", value);
                                   }}
                            />
                            <Input label="Database password"
                                   isRequired
                                   labelPlacement="inside"
                                   name="dbpass"
                                   description="Database password for user" validate={(value) => {
                                       if(value.length > 0){
                                           return null;
                                       } else {
                                           return "This field is required";
                                       }
                            }}
                            onChange={(e) => {
                                const {value} = e.target;
                                ValidateTextInput("dbpass", value);
                            }}/>
                            <Input label="Database port" type="number"
                                   isRequired
                                   labelPlacement="inside"
                                   name='dbport'
                                   description="On most hosting providers the default port is 3306. If unsure, please contact your hosting provider for MySQL connection port."
                                   defaultValue="3306"
                                   validate={(value:string) => {
                                     if(value.length > 0){
                                         return null;
                                     } else {
                                         return "This field is required";
                                     }
                                   }}
                                   onChange={(e) => {
                                       const {value} = e.target;
                                       setDbData((prev) => ({...prev, dbport:value}));
                                   }}
                            />
                            <div className="flex w-[100%] flex-col flex-wrap space-y-3">
                                <Button isLoading={isLoading} className="bg-primary" onPress={ValidateAndSend}>
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    ) : null;
    const promptForTableRemoval = isInstalling && step === 3 && dbTables.length > 0 ? (
        <>
            <Modal isOpen={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Remove database tables?</ModalHeader>
                    <ModalBody>
                        <p>Installer detected that your database is not empty. The following database tables were detected:</p>
                        <ul>
                            {dbTables.map((item,key) => (
                                <li key={dbTables[key]}>{item}</li>
                            ))}
                        </ul>
                        <p>Processing with installation will remove all existing tables in selected database.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-primary" isLoading={isRemoving} onPress={RemoveTables}>
                            Delete tables
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    ) : null;
    const welcomeText = !isInstalling && !isCompleted ? <p>Welcome to the BlogForge web installation script. This check will now perform DB Connection check.</p> : null;
    const installStatusText = isInstalling ? (
        <>
            <span>Install status:</span>
            <Textarea readOnly={true} value={installStatus.join("\n")}>
            </Textarea>
        </>
    ) : null;
    const showStartInstallBtn = !isInstalling && !isCompleted ? (
            <>
                <div className="flex flex-row flex-wrap w-[100%] justify-center">
                    <Button className="bg-primary" isLoading={isLoading && isInstalling} onPress={onClickEvent}>
                        <span className="text-white">Continue</span>
                    </Button>
                </div>
            </>
    ) : null;
    const ValidateInput  = (type:AllowedValidationType, key:AllowedSettingFormType, value:string) => {
        switch (type) {
            case "text":
                if (/^[a-zA-Z0-9\s!?.]+$/.test(value)) {
                    setSettingErrors((prev) => ({...prev, [key]: null}));
                    setSettingsData((prev) => ({...prev, [key]: value}));
                    return true;
                } else {
                    setSettingsData((prev) => ({...prev, [key]: null}));
                    setSettingErrors((prev) => ({...prev, [key]: "This field is invalid!"}));
                    return false;
                }
            case "number":
                const number = Number(value);
                if (isNaN(number)) {
                    setSettingErrors((prev) => ({...prev, [key]: "Invalid number format!"}));
                    setSettingsData((prev) => ({...prev, [key]: null}));
                    return false;
                } else {
                    setSettingErrors((prev) => ({...prev, [key]: null}));
                    setSettingsData((prev) => ({...prev, [key]: value}));
                    return true;
                }
        }
    }
    const onChangeFormInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name,value, type} = e.target;
        ValidateInput(type as AllowedValidationType,name as AllowedSettingFormType,value);
    }
    const SetLogo = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files){
            const file = files[0];
            switch(file.type)
            {
                case 'image/jpeg':
                case 'image/png':
                case 'image/bmp':
                    setSettingsData((prev) => ({...prev, website_logo:file}));
                    return;
                default:
                    setSettingErrors((prev) => ({...prev, website_logo:"This file extension is not suppported!"}));
                    return;

            }
        }
    }
    const saveChanges = async () => {
        const form = new FormData();
        setAttachment((prev) => ({...prev, isUploading:true}));
        (Object.entries(settingsData) as [AllowedSettingFormType, string|Blob|null|boolean|number][]).forEach(([key, value]) => {
           if(value instanceof Blob) {
               form.set(key, value);
           } else if (value !== null) {
               form.set(key, String(value));
           }
        });
        const reader = new FileReader();
        reader.onload = () => {
            setAttachment((prev) => ({...prev, src:reader.result}));
        }
        if(settingsData.website_logo instanceof Blob) {
            reader.readAsDataURL(settingsData.website_logo);
        }
        const response = await axios.post("/api/db/migrations/settings", form, {
           headers:{
               "Content-Type":"multipart/form-data"
           },
            onUploadProgress:(event) => {
                   const percent = typeof settingsData.website_logo !== null && settingsData.website_logo instanceof Blob ? settingsData.website_logo.size / 100 : null;
                   if(percent !== null) {
                       const uploadedPercentage = event.loaded / percent;
                       setAttachment((prev) => ({...prev, uploadPercent:uploadedPercentage}));
                       if(uploadedPercentage === 100) {
                           setAttachment((prev) => ({...prev, isUploading:false}));
                       }
                   }
            }
        });
        const resData :DBConnection = response.data;
        if(resData.success) {
            setIsLoading(false);
            setAttachment((prev) => ({...prev, isUploading:false}));
            setIsCompleted(true);
            setIsInstalling(false);
            setHeading("Installation completed");
            setStep(8);
        }
    }
    const showInstallProgress = attachment.isUploading ? (
        <>
            <div className="flex w-[100%] justify-center absolute z-[10] top-0 left-0 right-0 bottom-0">
                <CircularProgress
                    aria-label={`Uploading ${attachment.uploadPercent}%`}
                    color="warning"
                    showValueLabel={true}
                    value={typeof attachment.uploadPercent === "number" ? attachment.uploadPercent : 0}/>
            </div>
        </>
    ) : null
    const showAttachmentPreview = attachment.src ? (
        <>
            <div className="flex flex-col w-[100%] flex-wrap items-start">
                <Card className="flex w-[100px] h-[100px] p-3 relative">
                    <Image src={typeof attachment.src === "string" ? attachment.src : ''} alt="Website logo" className="w-[100%] h-[100%] opacity-[0.3]" width={100} height={100}/>
                    {showInstallProgress}
                </Card>
            </div>
        </>
    ) : null;
    const showInstallCompleted = !isInstalling && isCompleted ? (
        <>
            <p>Installation has been successfully completed and <b>install.lock</b> file has been successfully created. If you want to reinstall your app, please remove <b>storage/app/install.lock</b> from your laravel storage directory.</p>
        </>
    ) : null;
    const showWebsiteSettingForm = isInstalling && step === 7 ? (
        <>
            <Modal isOpen={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Website default settings</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Input type="text" isRequired
                                   name="website_name"
                                   label="Website name"
                                   labelPlacement="inside"
                                   isInvalid={!!settingErrors.website_name}
                                   onChange={onChangeFormInput}
                                   errorMessage={typeof settingErrors.website_name === "string" ? settingErrors.website_name : null}
                            />
                            <Input type="number" isRequired
                                   name="registration_min_age"
                                   label="Registration minimum age"
                                   labelPlacement="inside"
                                   isInvalid={!!settingErrors.registration_min_age}
                                   onChange={onChangeFormInput}/>
                            <span className="text-small">Users below this age will not be able to complete the registration</span>
                            <Switch defaultSelected={typeof settingsData.registration_enabled === 'boolean' ? settingsData.registration_enabled : true} onChange={() => {
                                setSettingsData((prev) => ({...prev, registration_enabled: !prev.registration_enabled}));
                            }}>Registration Enabled</Switch>
                            <span className="text-small">Are you allowing new registrations on your website?</span>
                            <Switch defaultSelected={typeof settingsData.verify_email_address === 'boolean' ? settingsData.verify_email_address : true} onChange={() => {
                                setSettingsData((prev) => ({...prev, verify_email_address:!prev.verify_email_address}));
                            }}>Registration Email Confirmation required</Switch>
                            <span className="text-small">Users will need to confirm their email address in order to complete the registration</span>
                            <Input type="file"
                                   isRequired
                                   label="Upload logo"
                                   labelPlacement="inside"
                                   isInvalid={!!settingErrors.website_logo}
                                   onChange={SetLogo}
                                   errorMessage={typeof settingErrors.website_logo === "string" ? settingErrors?.website_logo : null}
                            />
                            <span className="text-small">Accepted image types: .png, .jpg and .bmp.</span>
                            {showAttachmentPreview}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex w-[100%] flex-row justify-center">
                            <Button isLoading={isLoading} onPress={saveChanges} className="bg-primary">
                                Save changes
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    ) : null;
    return (
        <div className="flex flex-col w-[100%] flex-wrap h-[30em] justify-center md:items-center">
            <Card className="flex w-[100%] md:w-[50%] flex-col flex-wrap items-start p-4">
                <div className="flex w-[100%] items-center justify-center flex-wrap">
                    <h2 className="font-bold">Current status: {headingText}</h2>
                </div>
                <span>Step {step} / 8</span>
                {welcomeText}
                {installStatusText}
                {promptForDBDetails}
                {promptForTableRemoval}
                {showAdminForm}
                {showWebsiteSettingForm}
                {showStartInstallBtn}
                {showInstallCompleted}
            </Card>
        </div>
    )
});
