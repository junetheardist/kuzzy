import React from 'react';
import Link from 'next/link';

const navItems = [
    {name: 'Inventory', path: '/features/inventory'},
    {name: 'Vendors', path: '/features/vendors'},
    {name: 'Agents', path: '/features/agents'},
    {name: 'Deliveries', path: '/features/deliveries'},
];

export default function Sidebar() {
    return (
        <aside className="w-124 bg-white  rounded-3xl p-8   ">
            <nav>
                <ul className="space-y-4 flex  gap-3 ">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link href={item.path} className="text-lg  hover:text-blue-600">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
