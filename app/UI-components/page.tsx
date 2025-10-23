'use client';
import React from 'react';
import { CompactOrderList, OrderList, TableOrderList } from "@/components/orders/OrderList"; // 
import UserMap from '@/components/dashboard/UserMap';
import { orders } from '@/data/orders';
import { useState } from 'react';


export default function UiComponents() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className='w-screen relative flex items-center justify-center  h-screen '>
      <div className='absolute flex  top-5  outline p-6  gap-4 h-[90vh] w-[90vw] rounded-2xl  z-10 pointer-events-none '>

        <div className=' w-md h-full py-8  rounded-xl  relative z-20 overflow-y-scroll pointer-events-auto bg-white  '>


          <h2 className="text-lg font-semibold mb-2 ml-2 ">Orders Compact list</h2>
          <CompactOrderList orders={orders} />

        </div>
        <div
          onClick={() => setExpanded(!expanded)}
          className={`transition-all duration-500 p-3  ease-in-out bg-white rounded-xl relative  flex-1 pointer-events-auto  overflow-hidden cursor-pointer ${expanded ? 'h-full' : 'h-[100px]'
            }`}
        >
          <div className=' h-full overflow-y-scroll '>
            <h2 className="text-lg font-semibold mb-2 ml-2 ">Orders Table list</h2>
            <TableOrderList orders={orders} />
          </div>
        </div>

      </div>
      <UserMap />
    </div>
  );
}
