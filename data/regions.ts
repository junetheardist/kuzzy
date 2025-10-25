import { Region, State, LGA, Community, Street } from "@/types/region";
import { getStoreCount, getCustomerCount, getOrderCount, getProductCount, getDeliveryAgentCount } from "@/lib/data-utils";

const southSouthStates = ["Rivers", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Abuja"];
const southWestStates = ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"];

const riversLGAs = ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre"];
const lagosLGAs = ["Ikeja", "Eti-Osa", "Surulere", "Alimosho"];

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
    storeCount: getStoreCount(southSouthStates),
    orderCount: getOrderCount(southSouthStates),
    productCount: getProductCount(southSouthStates),
    customerCount: getCustomerCount(southSouthStates),
  },
  {
    id: "REG-SW",
    name: "South-West",
    sublocationNames: ["Lagos", "Ogun", "Oyo", "Osun", "Ondo", "Ekiti"],
    storeCount: getStoreCount(southWestStates),
    orderCount: getOrderCount(southWestStates),
    productCount: getProductCount(southWestStates),
    customerCount: getCustomerCount(southWestStates),
  },
];

export const states: State[] = [
  {
    id: "STA-RV",
    name: "Rivers",
    regionId: "REG-SS",
    sublocationNames: riversLGAs,
    storeCount: getStoreCount(["Rivers"]),
    orderCount: getOrderCount(["Rivers"]),
    productCount: getProductCount(["Rivers"]),
    customerCount: getCustomerCount(["Rivers"]),
  },
  {
    id: "STA-LA",
    name: "Lagos",
    regionId: "REG-SW",
    sublocationNames: lagosLGAs,
    storeCount: getStoreCount(["Lagos"]),
    orderCount: getOrderCount(["Lagos"]),
    productCount: getProductCount(["Lagos"]),
    customerCount: getCustomerCount(["Lagos"]),
  },
];

export const lgas: LGA[] = [
  {
    id: "LGA-PH",
    name: "Port Harcourt",
    stateId: "STA-RV",
    sublocationNames: ["Old GRA", "New GRA", "D-Line", "Diobu"],
    storeCount: getStoreCount(["Rivers"]), // Simplified for mock
    orderCount: getOrderCount(["Rivers"]),
    productCount: getProductCount(["Rivers"]),
    customerCount: getCustomerCount(["Rivers"]),
  },
  {
    id: "LGA-ETI",
    name: "Eti-Osa",
    stateId: "STA-LA",
    sublocationNames: ["Lekki Phase 1", "Victoria Island", "Ikoyi"],
    storeCount: getStoreCount(["Lagos"]), // Simplified for mock
    orderCount: getOrderCount(["Lagos"]),
    productCount: getProductCount(["Lagos"]),
    customerCount: getCustomerCount(["Lagos"]),
  },
  {
    id: "LGA-IKE",
    name: "Ikeja",
    stateId: "STA-LA",
    sublocationNames: ["Ikeja GRA", "Opebi", "Allen Avenue"],
    storeCount: getStoreCount(["Lagos"]), // Simplified for mock
    orderCount: getOrderCount(["Lagos"]),
    productCount: getProductCount(["Lagos"]),
    customerCount: getCustomerCount(["Lagos"]),
  },
];

export const communities: Community[] = [
  {
    id: "COM-PHGRA",
    name: "Old GRA",
    lgaId: "LGA-PH",
    sublocationNames: ["Olu Obasanjo Road", "Tombia Street", "Forces Avenue"],
    storeCount: getStoreCount(["Rivers"]), // Simplified
    orderCount: getOrderCount(["Rivers"]),
    productCount: getProductCount(["Rivers"]),
    customerCount: getCustomerCount(["Rivers"]),
  },
  {
    id: "COM-LEKKI1",
    name: "Lekki Phase 1",
    lgaId: "LGA-ETI",
    sublocationNames: ["Admiralty Way", "Fola Osibo Road", "Omorinre Johnson Street"],
    storeCount: getStoreCount(["Lagos"]), // Simplified
    orderCount: getOrderCount(["Lagos"]),
    productCount: getProductCount(["Lagos"]),
    customerCount: getCustomerCount(["Lagos"]),
  },
  {
    id: "COM-IKEGRA",
    name: "Ikeja GRA",
    lgaId: "LGA-IKE",
    sublocationNames: ["Isaac John Street", "Oduduwa Crescent", "Joel Ogunnaike Street"],
    storeCount: getStoreCount(["Lagos"]), // Simplified
    orderCount: getOrderCount(["Lagos"]),
    productCount: getProductCount(["Lagos"]),
    customerCount: getCustomerCount(["Lagos"]),
  },
];

export const streets: Street[] = [
  {
    id: "STR-OLU",
    name: "Olu Obasanjo Road",
    communityId: "COM-PHGRA",
    sublocationNames: [],
    storeCount: 1, // Highly specific, manual override might be needed
    orderCount: 10,
    productCount: 50,
    customerCount: 20,
  },
  {
    id: "STR-FOLA",
    name: "Fola Osibo Road",
    communityId: "COM-LEKKI1",
    sublocationNames: [],
    storeCount: 1, // Highly specific, manual override might be needed
    orderCount: 50,
    productCount: 200,
    customerCount: 100,
  },
];