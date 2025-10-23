import React from 'react'

export default function Header() {
    return (
        <div className={"top-0 z-50 bg-white w-full px-5 border-b fixed  flex  items-center gap-16  left-0 right-0 h-14"}>
            Kozzy
            <span className={'list-none flex items-center gap-6  '}>
                <li>Operartion</li>
                <li>Employees</li>
                <li>Reviews</li>
            
            </span> 
        
        </div>
    )
}
