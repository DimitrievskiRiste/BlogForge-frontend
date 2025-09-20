"use client"
import {memo, useState} from "react"
import Navbar from "@/ui/navbar/navbar";
import {AppContext} from "@/contexts/App";
import Footer from "@/ui/footer";
import {Tabs} from "@heroui/tabs";
import {CardBody, Tab} from "@heroui/react";
import {Button} from "@heroui/button";
import {Card} from "@heroui/card";
import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {SettingData} from "@/server";
type ImageData = {
    mime_type: string
    blob: string
}
type AppProps = {
    setting?:SettingData
    image?:ImageData
    hasErrors?:boolean
    message?:string
}
type HomePageProps = {
    appData:AppProps | null
}
export const Homepage = memo(function Homepage({appData}:HomePageProps){
    const [data] = useState(appData);
    return (
        <>
            <AppContext value={data}>
                <Navbar/>
                <div className="flex flex-col w-[100%] flex-wrap mt-[5em]">
                    <div className="flex relative flex-row w-[100%] space-y-1 space-x-1">
                        <h1 className="page-title">{data?.setting?.website_name}</h1>
                    </div>
                    <div className="flex items-center  flex-col w-[100%] flex-wrap relative">

                        <div className="flex flex-row flex-wrap w-[90%] md:w-[80%] justify-center  justify-items-center space-x-2 space-y-2">
                            <section id="discover" className="page-section flex w-[100%] md:w-[60%] flex-col flex-wrap space-y-1">
                                <div className="section-blog-heading">
                                    <div className="section-blog-content">
                                        <h2 className="section-title">Discover premium quality content and participate in discussions by joining us today.</h2>
                                        <div className="flex flex-col md:flex-row w-[100%] flex-wrap items-center justify-center space-y-1 space-x-1">
                                            <Button className="button bg-default">
                                                <span className="font-bold text-neutral-900">Login</span>
                                            </Button>
                                            <Button className="button bg-primary">
                                                <span className="font-bold text-neutral-950">Sign up</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <Tabs aria-label={'Options'} className="w-full bg-neutral-200 text-neutral-900">
                                    <Tab key={'featuredBlogs'}
                                         title="Featured Blogs" className="text-neutral-900">
                                                <Card>
                                                    <CardBody>
                                                        <div className="block w-full text-center p-4">
                                                            <p>There are currently no featured blogs at the moment.</p>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                    </Tab>
                                    <Tab key={'latestBlogs'}
                                         title="Latest Blogs" className="text-neutral-900">
                                        <p>Latest blogs</p>
                                    </Tab>
                                </Tabs>
                            </section>
                            <div aria-hidden={true} className="hidden md:flex w-[350px] flex-wrap self-start flex-col space-y-2 space-x-1">
                                <section id="login" className="flex w-full flex-wrap relative ui-block p-10 justify-center">
                                    <h2 className="section-title">Login</h2>
                                    <Form className="flex flex-col w-full">
                                        <Input type="email" label="Email address" required={true} aria-required={true}
                                               aria-placeholder="example@example.com"/>
                                        <Input type="password" label="Password" required={true} aria-required={true}/>
                                        <Button type="button" className="bg-primary text-neutral-100 w-full">Login</Button>
                                        <div className="flex flex-row items-center w-full">
                                            <div className="whiteLine"></div>
                                            <span>or</span>
                                            <div className="whiteLine"></div>
                                        </div>
                                        <Button type="button" className="bg-amber-500 text-neutral-100 w-full">Register</Button>
                                    </Form>
                                </section>
                                <section id="stats" className="flex w-[100%] md:w-[350px] flex-wrap ui-block relative flex-col p-10 self-start">
                                    <div className="flex w-full flex-wrap justify-center">
                                        <h2 className="section-title">Statistics</h2>
                                    </div>
                                    <dl className="flex flex-row w-[200px] flex-wrap items-end space-between space-x-1">
                                        <dt>Registered Members:</dt>
                                        <dd>0</dd>
                                        <dt>Total blogs:</dt>
                                        <dd>0</dd>
                                    </dl>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </AppContext>
        </>
    )
})
