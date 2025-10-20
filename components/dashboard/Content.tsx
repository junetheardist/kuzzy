import React from 'react'
import Sidebar from "@/components/dashboard/Sidebar";
import MainContent from "@/components/dashboard/MainContent";

export default function Content() {
    return (
        <div className={'top-[100px] left-[100px] absolute  right-[100px] bottom-[100px] flex-row flex gap-8'}>
            <Sidebar/>
            <MainContent/>
        </div>
    )
}
