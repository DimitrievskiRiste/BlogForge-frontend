"use client";
import React, {memo, useCallback, useEffect, useState} from "react";
import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {Checkbox, Spinner} from "@heroui/react";
import Footer from "@/ui/footer";
import {useRouter} from "next/navigation";
import {UserData} from "@/Types/UserTypes";
export const AdminLogin = memo(function AdminLogin(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    type LoginData = {
        [key:string]:null|string
    }
    const [formErrors, setFormErrors] = useState<LoginData>({
        email:null,
        password:null
    });
    const [data, setData] = useState({
        email:null,
        password:null
    });
    const updateInput = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
        const t = e.target, v = t.value, n = t.name;
        if(v){
            setFormErrors((prev) => ({...prev, [n]:null}));
            setData((prev) => ({...prev, [n]:v}));
        }
    },[]);
    const onSubmitForm = useCallback(async () => {
        if (!data.email) {
            setFormErrors((prev) => ({...prev, email: "Email is mandatory!"}));
        }
        if (!data.password) {
            setFormErrors((prev) => ({...prev, password: 'Password is mandatory'}));
        }
        if (data.email && data.password) {
            setIsLoading(true);
            type ResType = {
                isLoggedIn: boolean
                isAdmin: boolean,
                user?:UserData
                token?:string
                secret?:string
                tokenPass?:string
            }
            const res = await fetch("/api/admin/login", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data)
            });
            const resData: ResType = await res.json();
            if (resData.isLoggedIn && resData.isAdmin && resData.token && resData.user && resData.secret && resData.tokenPass) {
                localStorage.setItem('token', resData.token);
                localStorage.setItem('secret', resData.secret);
                localStorage.setItem('tokenPass', resData.tokenPass);
                localStorage.setItem('user',JSON.stringify(resData.user));
                setIsLoading(false);
                setIsLoggedIn(true);
            } else {
                setIsLoading(false);
                setFormErrors((prev) => ({...prev, email: "Not an admin or account not found!"}));
            }
        }
    },[data]);
    const showLoginForm = !isLoggedIn ? (
        <>
            <div className="flex flex-col space-y-1 absolute h-full w-full justify-center items-center content-center">
                <div className="flex flex-col ui-block p-10 w-[90%] space-y-1 md:w-[350px]">
                    <h1 className="page-title text-center">Admin Panel Login</h1>
                    <Form className="relative w-full p-[10] flex flex-col">
                        <Input type="email" aria-required={true} name="email" label="Email address" onChange={updateInput} isInvalid={!!formErrors.email} errorMessage={formErrors.email}/>
                        <Input type="password" aria-required={true} name="password" errorMessage={formErrors.password} onChange={updateInput} isInvalid={!!formErrors.password} label="Password"/>
                        <Button type="button" isLoading={isLoading} onPress={onSubmitForm} className="bg-primary w-full text-center text-neutral-100">Complete Login</Button>
                    </Form>
                </div>
                <Footer/>
            </div>
        </>
    ) : null;
    const showRedirectForm = isLoggedIn ? (
        <>
            <RedirectionMessage/>
        </>
    ) : null;
    return (
        <>
            {showLoginForm}
            {showRedirectForm}
        </>
    )
});
export const LoadingMessage = memo(function LoadingMessage() {
   return (
       <>
           <div className="flex flex-col space-y-1 absolute h-full w-full justify-center items-center content-center">
               <div className="flex flex-col ui-block p-10 w-[90%] space-y-1 md:w-[550px]">
                   <h1 className="text-center !font-bold">Admin Panel Login</h1>
                   <div className="flex flex-row space-x-1 flex-wrap w-full items-center">
                       <Spinner size="sm" color="primary"/>
                       <div className="flex w-[90%] flex-col flex-wrap">
                           <span>Verifying user session authentication & authorization for admin control panel.</span>
                       </div>
                   </div>
               </div>
           </div>
       </>
   )
});
export const RedirectionMessage = memo(function RedirectionMessage() {
    const nav = useRouter();
    const [btn, setBtn] = useState("Click here if not redirected");
    const [tasks, setTasks] = useState({
        task_2:false
    });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const timeout = setInterval(() => {
            setTasks((prev) => ({...prev, task_2:true}));
            nav.push("/admin");
        },2000);
        return () => clearInterval(timeout);
    }, [nav]);
    function onClickEvent() {
        setIsLoading(true);
        setBtn("Redirecting...");
        nav.push("/admin");
    }
    return (
        <>
            <div className="absolute flex flex-col w-full  space-y-1 justify-center items-center content-center h-[100%]">
                <div className="ui-block flex flex-col space-y-3 w-[90%] md:w-[450px] p-10">
                    <h1 className="text-center">Redirecting...</h1>
                    <Checkbox isDisabled defaultSelected><span className="!text-neutral-900">Successfully logged in & authorized.</span></Checkbox>
                    <Checkbox isDisabled isSelected={tasks.task_2}><span className="!text-neutral-900">You will be redirected to the dashboard withing few seconds. If you automatically redirected, please click the button below.</span></Checkbox>
                    <div className="flex w-full flex-wrap justify-center">
                        <Button type="button" isLoading={isLoading} onPress={onClickEvent} className="bg-primary text-center text-neutral-100 font-bold">
                            {btn}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
});
