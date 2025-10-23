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
        <aside className="w-124 bg-red-500 rounded-3xl p-8   ">
            <h2 className="text-xl font-bold mb-6">Kuzi Dashboard</h2>
            <nav>
                <ul className="space-y-4">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link href={item.path} className="text-lg hover:text-blue-600">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
