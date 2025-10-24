import { Region, State, LGA, Community, Street } from "@/types/region";

export const regions: Region[] = [
  {
    id: "REG-SS",
    name: "South-South",
    sublocationNames: [
      "Rivers",
      "Akwa Ibom",
      "Bayelsa",
      "Cross River",
      "Delta",
      "Edo",
    ],
    storeCount: 150,
    orderCount: 2500,
    productCount: 12000,
    userCount: 5000,
  },
  {
    id: "REG-SW",
    name: "South-West",
    sublocationNames: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
    storeCount: 450,
    orderCount: 18000,
    productCount: 95000,
    userCount: 22000,
  },
];

export const states: State[] = [
  {
    id: "STA-RV",
    name: "Rivers",
    regionId: "REG-SS",
    sublocationNames: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre"],
    storeCount: 80,
    orderCount: 1200,
    productCount: 6000,
    userCount: 2500,
  },
  {
    id: "STA-LA",
    name: "Lagos",
    regionId: "REG-SW",
    sublocationNames: ["Ikeja", "Eti-Osa", "Surulere", "Alimosho"],
    storeCount: 350,
    orderCount: 15000,
    productCount: 80000,
    userCount: 18000,
  },
];

export const lgas: LGA[] = [
  {
    id: "LGA-PH",
    name: "Port Harcourt",
    stateId: "STA-RV",
    sublocationNames: ["Old GRA", "New GRA", "D-Line", "Diobu"],
    storeCount: 50,
    orderCount: 800,
    productCount: 4000,
    userCount: 1500,
  },
  {
    id: "LGA-ETI",
    name: "Eti-Osa",
    stateId: "STA-LA",
    sublocationNames: ["Lekki Phase 1", "Victoria Island", "Ikoyi"],
    storeCount: 120,
    orderCount: 7000,
    productCount: 45000,
    userCount: 9000,
  },
  {
    id: "LGA-IKE",
    name: "Ikeja",
    stateId: "STA-LA",
    sublocationNames: ["Ikeja GRA", "Opebi", "Allen Avenue"],
    storeCount: 90,
    orderCount: 4500,
    productCount: 20000,
    userCount: 5000,
  },
];

export const communities: Community[] = [
  {
    id: "COM-PHGRA",
    name: "Old GRA",
    lgaId: "LGA-PH",
    sublocationNames: ["Olu Obasanjo Road", "Tombia Street", "Forces Avenue"],
    storeCount: 15,
    orderCount: 250,
    productCount: 1200,
    userCount: 400,
  },
  {
    id: "COM-LEKKI1",
    name: "Lekki Phase 1",
    lgaId: "LGA-ETI",
    sublocationNames: ["Admiralty Way", "Fola Osibo Road", "Omorinre Johnson Street"],
    storeCount: 60,
    orderCount: 4000,
    productCount: 25000,
    userCount: 5500,
  },
  {
    id: "COM-IKEGRA",
    name: "Ikeja GRA",
    lgaId: "LGA-IKE",
    sublocationNames: ["Isaac John Street", "Oduduwa Crescent", "Joel Ogunnaike Street"],
    storeCount: 30,
    orderCount: 1500,
    productCount: 8000,
    userCount: 1800,
  },
];

export const streets: Street[] = [
  {
    id: "STR-OLU",
    name: "Olu Obasanjo Road",
    communityId: "COM-PHGRA",
    sublocationNames: [],
    storeCount: 5,
    orderCount: 80,
    productCount: 450,
    userCount: 120,
  },
  {
    id: "STR-FOLA",
    name: "Fola Osibo Road",
    communityId: "COM-LEKKI1",
    sublocationNames: [],
    storeCount: 12,
    orderCount: 900,
    productCount: 6000,
    userCount: 1100,
  },
];