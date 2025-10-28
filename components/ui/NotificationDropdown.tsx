import React from 'react';
import { Package, User, AlertTriangle } from 'lucide-react';

const notificationIcons = {
  order: <Package className="w-5 h-5 text-blue-500" />,
  customer: <User className="w-5 h-5 text-green-500" />,
  alert: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const mockNotifications = [
  {
    id: 1,
    type: 'order' as const,
    title: 'New Order',
    message: 'Order #ORD-015 placed by Amina Yusuf.',
    details: 'Value: ₦25,500',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'customer' as const,
    title: 'New Customer',
    message: 'John Doe has registered.',
    details: 'Location: Lagos, Nigeria',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'alert' as const,
    title: 'Low Stock Alert',
    message: 'Store "Mega Mart" has low stock.',
    details: 'Items: Peak Milk, Golden Morn, Milo',
    time: '3 hours ago',
  },
];

export const NotificationDropdown = () => {
  return (
    <div className="absolute top-14 right-0 w-80 bg-white rounded-lg shadow-lg border z-40">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="divide-y">
        {mockNotifications.map((notification) => (
          <div key={notification.id} className="p-4 flex items-start gap-4 hover:bg-gray-50">
            <div className="flex-shrink-0 mt-1">{notificationIcons[notification.type]}</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.details}</p>
              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 text-center border-t">
        <a href="#" className="text-sm text-indigo-600 hover:underline">
          View all notifications
        </a>
      </div>
    </div>
  );
};