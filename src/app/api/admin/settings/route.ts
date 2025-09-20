import {SettingData} from "@/Types/SettingsFormType";

export async function POST(req:Request)
{
    const data :SettingData = await req.json();

}
