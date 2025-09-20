"use client";
import {Card} from "@heroui/card";
import {Skeleton} from "@heroui/react";

export const PageLoading = () => {
    return (
        <>
            <div className="flex w-full flex-col space-y-1 flex-wrap items-start">
                <Card className="w-full" radius="none">
                    <Skeleton className="rounded-lg" isLoaded={false}>
                        <div className="h-10 bg-secondary rounded-lg"></div>
                    </Skeleton>
                </Card>
                <div className="flex flex-row w-full  flex-wrap items-start space-x-[20%]">
                    <Card className="w-[100px]" radius="none">
                        <Skeleton className="rounded-lg" isLoaded={false}>
                            <div className="h-[100vh] bg-secondary rounded-lg"></div>
                        </Skeleton>
                    </Card>
                    <Card className="w-[50%]" radius="none">
                        <Skeleton className="rounded-lg" isLoaded={false}>
                            <div className="h-[100vh] bg-secondary rounded-lg"></div>
                        </Skeleton>
                    </Card>
                </div>
            </div>
        </>
    )
}
