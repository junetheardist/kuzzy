/**
 * A generic interface for a list item representing a geographical area.
 * This can be used for displaying Regions, States, LGAs, etc., in a list.
 */
export interface RegionListItem {
  id: string;
  name: string;
  /** A truncated list of names for the sub-locations within this area (e.g., names of states in a region). */
  sublocationNames: string[];
  storeCount: number;
  orderCount: number;
  productCount: number;
  customerCount: number;
}

/** Represents a top-level region (e.g., "South-South", "North-Central"). */
export interface Region extends RegionListItem {
  // Regions are top-level in this model.
}

/** Represents a state within a region (e.g., "Lagos", "Rivers"). */
export interface State extends RegionListItem {
  regionId: Region["id"];
}

/** Represents a Local Government Area (LGA) or City within a state. */
export interface LGA extends RegionListItem {
  stateId: State["id"];
}

/** Represents a community, town, or ward within an LGA. */
export interface Community extends RegionListItem {
  lgaId: LGA["id"];
}

/** Represents a street or a very specific micro-location within a community. */
export interface Street extends RegionListItem {
  communityId: Community["id"];
  // Streets are considered the lowest level and have no further sublocations in this model.
  sublocationNames: [];
}