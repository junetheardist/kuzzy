// src/data/orders.ts
import {Order} from "@/types/order";

export const orders: Order[] = [
    {
        id: "ORD-001",
        storeId: "STORE-001", // Gadget Haven
        customerName: "Jane Doe",
        date: "2025-10-20",
        status: "pending",
        total: 400000,
        items: [
            {
                id: "ELEC-001",
                name: "Wireless Bluetooth Headphones",
                image: "https://i.pinimg.com/1200x/e0/ad/3e/e0ad3ec225c1801ddbad74600ac4b87e.jpg",
                price: 150000,
                category: "electronics",
                quantity: 1,
            },
            {
                id: "ELEC-002",
                name: "Smartwatch Series 8",
                image: "https://i.pinimg.com/736x/91/27/5b/91275bc0c1f2760149751e0d6929b0b6.jpg",
                price: 250000,
                category: "electronics",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-002",
        storeId: "STORE-002", // FreshMart
        customerName: "Alice Williams",
        date: "2025-10-20",
        status: "completed",
        total: 12500,
        items: [
            {
                id: "GROC-001",
                name: "Organic Avocado (3-pack)",
                image: "https://i.pinimg.com/736x/94/ea/eb/94eaeb47e2604a0b4c5d79f4a1d0467b.jpg",
                price: 5000,
                category: "groceries",
                quantity: 1,
            },
            {
                id: "GROC-002",
                name: "Jringe fresh Orange Juice (1L)",
                image: "https://i.pinimg.com/736x/b8/c7/52/b8c752c3dbc8d6d8c61f162861646e36.jpg",
                price: 3500,
                category: "groceries",
                quantity: 1,
            },
            {
                id: "GROC-003",
                name: "Dozen Free-Range Eggs",
                image: "https://i.pinimg.com/1200x/23/a9/44/23a944df72c534925c1eb3d7f942a801.jpg",
                price: 4000,
                category: "groceries",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-003",
        storeId: "STORE-001", // Gadget Haven
        customerName: "John Smith",
        date: "2025-10-21",
        status: "pending",
        total: 15000,
        items: [
            {
                id: "CARE-001",
                name: "Vitamin C Face Serum",
                image: "https://i.pinimg.com/736x/df/fa/0d/dffa0dbc65fb5d8cbdf2e24c1928b07c.jpg",
                price: 15000,
                category: "body-care",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-004",
        storeId: "STORE-001", // Fashion store (hypothetical)
        customerName: "Emily Johnson",
        date: "2025-10-21",
        status: "cancelled",
        total: 120000,
        items: [
            {
                id: "ITM-004",
                name: "Leather Biker Jacket",
                image: "https://i.pinimg.com/1200x/33/c1/7d/33c17d8fbbd52c7acb8b13dec287cccb.jpg",
                price: 120000,
                category: "clothes",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-005",
        storeId: "STORE-001", // Gadget Haven
        customerName: "Michael Brown",
        date: "2025-10-22",
        status: "completed",
        total: 57500,
        items: [
            {
                id: "ELEC-003",
                name: "4K Ultra HD Webcam",
                image: "https://i.pinimg.com/736x/c2/e8/69/c2e869f2d3aaa4b52349c9db266ae4ff.jpg",
                price: 55000,
                category: "electronics",
                quantity: 1,
            },
            {
                id: "GROC-004",
                name: "Whole Wheat Bread",
                image: "https://i.pinimg.com/736x/00/c2/47/00c247b7740183217962139d3490b22f.jpg",
                price: 2500,
                category: "groceries",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-006",
        storeId: "STORE-001", // Fashion store (hypothetical)
        customerName: "Sarah Davis",
        date: "2025-10-23",
        status: "pending",
        total: 58500,
        items: [
            {
                id: "ITM-002",
                name: "Black Cargo Pants",
                image: "https://i.pinimg.com/736x/26/be/3a/26be3aa7fe1f9b93d7db419bdeb1e4ec.jpg",
                price: 50000,
                category: "clothes",
                quantity: 1,
            },
            {
                id: "CARE-002",
                name: "Olay Hydrating Body Lotion",
                image: "https://i.pinimg.com/736x/14/7c/f0/147cf0b35a37bf664872cece77e4c128.jpg",
                price: 8500,
                category: "body-care",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-007",
        storeId: "STORE-002", // FreshMart
        customerName: "David Wilson",
        date: "2025-10-24",
        status: "completed",
        total: 11000,
        items: [
            {
                id: "GROC-002",
                name: "Fresh Orange Juice (1L)",
                image: "https://i.pinimg.com/564x/7e/3a/5a/7e3a5a14a706b01d0cb42b26134f6c.jpg",
                price: 3500,
                category: "groceries",
                quantity: 2,
            },
            {
                id: "GROC-003",
                name: "Dozen Free-Range Eggs",
                image: "https://i.pinimg.com/564x/7e/3a/5a/7e3a5a14a706b01d0cb42b26134f6c.jpg",
                price: 4000,
                category: "groceries",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-008",
        storeId: "STORE-001", // Gadget Haven
        customerName: "Laura Taylor",
        date: "2025-10-25",
        status: "pending",
        total: 175000,
        items: [
            {
                id: "ELEC-001",
                name: "Wireless Bluetooth Headphones",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 150000,
                category: "electronics",
                quantity: 1,
            },
            {
                id: "CARE-003",
                name: "Charcoal Face Wash",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 25000,
                category: "body-care",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-009",
        storeId: "STORE-002", // FreshMart
        customerName: "James Anderson",
        date: "2025-10-25",
        status: "completed",
        total: 5000,
        items: [
            {
                id: "GROC-001",
                name: "Organic Avocado (3-pack)",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 5000,
                category: "groceries",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-010",
        storeId: "STORE-001", // Health & Beauty store (hypothetical)
        customerName: "Linda Martinez",
        date: "2025-10-26",
        status: "cancelled",
        total: 12000,
        items: [
            {
                id: "CARE-004",
                name: "SPF 50 Sunscreen",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 12000,
                category: "body-care",
                quantity: 1,
            },
        ],
    },
    {
        id: "ORD-011",
        storeId: "STORE-001", // Health & Beauty store (hypothetical)
        customerName: "Robert Hernandez",
        date: "2025-10-27",
        status: "pending",
        total: 30000,
        items: [
            {
                id: "CARE-001",
                name: "Vitamin C Face Serum",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 15000,
                category: "body-care",
                quantity: 2,
            },
        ],
    },
    {
        id: "ORD-012",
        storeId: "STORE-001", // Gadget Haven
        customerName: "Patricia Garcia",
        date: "2025-10-28",
        status: "completed",
        total: 320000,
        items: [
            {
                id: "ELEC-002",
                name: "Smartwatch Series 8",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 250000,
                category: "electronics",
                quantity: 1,
            },
            {
                id: "ELEC-004",
                name: "Vconol Power Bank, 20000mAh, 30W, Powerbank ricarica rapida mini con USB C, USB-A, ingresso/uscita, Caricabatteria portatile piccolo per iPhone 15/11, Samsung, Smartphone, iPad, Display LED, Nero - StraNotizie.it",
                image: "https://i.pinimg.com/1200x/69/42/7f/69427fad3984e11c6c6071b5494df301.jpg",
                price: 70000,
                category: "electronics",
                quantity: 1,
            },
        ],
    },
];
