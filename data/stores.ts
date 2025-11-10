import {Store, StoreCategory} from "@/types/Store";

export const storeCategories: StoreCategory[] = [
    {
        id: "CAT-01",
        name: "Groceries",
        slug: "groceries",
        description: "Fresh produce, pantry staples, and household goods.",
    },
    {
        id: "CAT-02",
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets, computers, and accessories.",
    },
    {
        id: "CAT-03",
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, shoes, and accessories for all.",
    },
    {
        id: "CAT-04",
        name: "Health & Beauty",
        slug: "health-beauty",
        description: "Skincare, makeup, and wellness products.",
    },
];

export const stores: Store[] = [
    {
        id: "STORE-001",
        vendorId: "VEND-001",
        name: "Gadget Haven",
        logo: "https://th.bing.com/th/id/R.9602fa3dbe9eb364e6c996ba179a8798?rik=kQMNwUo%2bw1%2foZw&riu=http%3a%2f%2f1.bp.blogspot.com%2f-NYTuyZpJM4Q%2fT7-_weFK2II%2fAAAAAAAAAIg%2fJfHOAwQuUXM%2fs1600%2f2013%252Bf.jpg&ehk=huSA%2f8I37SHKTUtiSQGJE%2bKa4GLM24Bp76f86KndLZo%3d&risl=&pid=ImgRaw&r=0",
        address: {
            street: "123 Allen Avenue",
            city: "Ikeja",
            state: "Lagos",
            country: "Nigeria",
            postalCode: "100282",
            latitude: 6.6018,
            longitude: 3.3515,
        },
        category: "electronics",
        status: "active",
        dateJoined: "2024-01-15",
        owner: {
            id: "USER-001",
            name: "Bolanle Adeoye",
            email: "bolanle.adeoye@example.com",
            primaryPhoneNumber: "08012345678",
            address: {
                street: "10 Fola Osibo Rd",
                city: "Lekki",
                state: "Lagos",
                country: "Nigeria",
                latitude: 6.4478,
                longitude: 3.4723,
            },
        },
        registrationDocuments: {
            businessRegistrationUrl: "/docs/cac_bolanle.pdf",
            idType: "national-id",
            idNumber: "12345678901",
            idDocumentUrl: "/docs/id_bolanle.pdf",
            proofOfAddressUrl: "/docs/proof_bolanle.pdf",
        },
        gallery: {
            coverImageUrl:
                "https://i.pinimg.com/1200x/e0/ad/3e/e0ad3ec225c1801ddbad74600ac4b87e.jpg",
            otherImagesUrl: [
                "https://i.pinimg.com/564x/c9/1d/9b/c91d9b355393655a5028424749323533.jpg",
                "https://i.pinimg.com/564x/de/9b/72/de9b7291511a78c3e1b3352c73913512.jpg",
            ],
        },
    },
    {
        id: "STORE-002",
        vendorId: "VEND-002",
        name: "FreshMart",
        logo: "https://i.pinimg.com/564x/c2/5a/f4/c25af439e1af227d1b319ab285349140.jpg",
        address: {
            street: "45 Gana Street",
            city: "Maitama",
            state: "Abuja",
            country: "Nigeria",
            postalCode: "904102",
            latitude: 9.0765,
            longitude: 7.4913,
        },
        category: "groceries",
        status: "pending",
        dateJoined: "2024-03-22",
        owner: {
            id: "USER-002",
            name: "Chidi Okoro",
            email: "chidi.okoro@example.com",
            primaryPhoneNumber: "09087654321",
            secondaryPhoneNumber: "08123456789",
            address: {
                street: "22 Adetokunbo Ademola Crescent",
                city: "Wuse II",
                state: "Abuja",
                country: "Nigeria",
                latitude: 9.0723,
                longitude: 7.4913,
            },
        },
        registrationDocuments: {
            idType: "drivers-license",
            idNumber: "ABJ12345XYZ",
            idDocumentUrl: "/docs/id_chidi.pdf",
            proofOfAddressUrl: "/docs/proof_chidi.pdf",
        },
        gallery: {
            coverImageUrl:
                "https://i.pinimg.com/736x/94/ea/eb/94eaeb47e2604a0b4c5d79f4a1d0467b.jpg",
            otherImagesUrl: [],
        },
    },
];
