"use client";
import {useState} from "react";

type StatisticsProps = {
    headline:string
    value:number
}
export default function Statistics({headline, value}:StatisticsProps) {
    const [data, setData] = useState<StatisticsProps>({
        headline:headline,
        value:value
    });
    return (
        <>
            <div className="ui-block w-[250px] relative flex flex-col flex-wrap items-center">
                <h2 className="!text-[22px]">{data.headline}</h2>
                <span className="text-[18px] font-bold">{data.value}</span>
            </div>
        </>
    )
};
