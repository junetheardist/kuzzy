import {NextResponse} from "next/server";

interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
}

// Category data with colors matching the map legend
const STORE_CATEGORIES: Category[] = [
    {
        id: "CAT-001",
        name: "Electronics",
        slug: "electronics",
        color: "#EF4444", // Red
    },
    {
        id: "CAT-002",
        name: "Clothing",
        slug: "clothing",
        color: "#F97316", // Orange
    },
    {
        id: "CAT-003",
        name: "Food",
        slug: "food",
        color: "#22C55E", // Green
    },
    {
        id: "CAT-004",
        name: "Groceries",
        slug: "groceries",
        color: "#84CC16", // Lime
    },
    {
        id: "CAT-005",
        name: "Pharmacy",
        slug: "pharmacy",
        color: "#06B6D4", // Cyan
    },
    {
        id: "CAT-006",
        name: "Home",
        slug: "home",
        color: "#8B5CF6", // Purple
    },
    {
        id: "CAT-007",
        name: "Beauty",
        slug: "beauty",
        color: "#EC4899", // Pink
    },
    {
        id: "CAT-008",
        name: "Books",
        slug: "books",
        color: "#6366F1", // Indigo
    },
    {
        id: "CAT-009",
        name: "Sports",
        slug: "sports",
        color: "#14B8A6", // Teal
    },
    {
        id: "CAT-010",
        name: "Furniture",
        slug: "furniture",
        color: "#A16207", // Brown
    },
];

export async function GET() {
    try {
        return NextResponse.json({
            categories: STORE_CATEGORIES,
            total: STORE_CATEGORIES.length,
        }, {status: 200});
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}
