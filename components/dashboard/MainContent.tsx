"use client"
import React, {useState} from 'react'
import {DialogDemo} from "@/components/dashboard/CreateVendor";

export default function MainContent() {
    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <div className={`bg-red-500 w-full rounded-3xl p-8 ${isExpanded ? "h-full" : "h-fit"}`}>
            <DialogDemo/>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Expand" : "Collapse"}
            </button>

        </div>
    )
}
