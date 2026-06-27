export type TableStatus = "available" | "reserved" | "occupied" | "cleaning";

export type TableCategory =
  | "Couple Table"
  | "Family Table"
  | "VIP Table"
  | "Business Table"
  | "Friends Table"
  | "Private Room"
  | "Window Table"
  | "Outdoor Table"
  | "Garden Table"
  | "Pool Table"
  | "Large Group Table";

export type RestaurantArea =
  | "Indoor Dining"
  | "Private Dining"
  | "VIP Room"
  | "Wine Cellar"
  | "Luxury Bar"
  | "Open Kitchen"
  | "Outdoor Seating"
  | "Garden"
  | "Live Music"
  | "Family Dining"
  | "Couple Zone"
  | "Business Lounge"
  | "Window Side"
  | "Private Cabin"
  | "Pool Side";

export interface TableData {
  id: string;
  tableNumber: string;
  category: TableCategory;
  area: RestaurantArea;
  capacity: number;
  minSpend: number;
  status: TableStatus;
  position: [number, number, number];
}

/* Floor plan zones laid out across a wide indoor + outdoor footprint */
const tables: TableData[] = [
  // Couple Zone (window side, front)
  { id: "A1", tableNumber: "A1", category: "Couple Table", area: "Couple Zone",      capacity: 2, minSpend: 2500,  status: "available", position: [-7, 0, -2] },
  { id: "A2", tableNumber: "A2", category: "Couple Table", area: "Couple Zone",      capacity: 2, minSpend: 2500,  status: "reserved",  position: [-7, 0,  0] },
  { id: "A3", tableNumber: "A3", category: "Window Table", area: "Window Side",      capacity: 2, minSpend: 5000,  status: "available", position: [-7, 0,  2] },

  // Indoor Dining (center)
  { id: "B1", tableNumber: "B1", category: "Family Table", area: "Indoor Dining",    capacity: 4, minSpend: 4500,  status: "available", position: [-3, 0, -2] },
  { id: "B2", tableNumber: "B2", category: "Family Table", area: "Family Dining",    capacity: 4, minSpend: 4500,  status: "occupied",  position: [-3, 0,  0] },
  { id: "B3", tableNumber: "B3", category: "Friends Table",area: "Indoor Dining",    capacity: 4, minSpend: 4000,  status: "available", position: [-3, 0,  2] },
  { id: "B4", tableNumber: "B4", category: "Friends Table",area: "Indoor Dining",    capacity: 6, minSpend: 6000,  status: "cleaning",  position: [ 0, 0, -2] },
  { id: "B5", tableNumber: "B5", category: "Family Table", area: "Indoor Dining",    capacity: 6, minSpend: 6500,  status: "available", position: [ 0, 0,  0] },
  { id: "B6", tableNumber: "B6", category: "Friends Table",area: "Indoor Dining",    capacity: 4, minSpend: 4000,  status: "reserved",  position: [ 0, 0,  2] },

  // Business Lounge
  { id: "C1", tableNumber: "C1", category: "Business Table", area: "Business Lounge",capacity: 6, minSpend: 8000,  status: "available", position: [ 3, 0, -2] },
  { id: "C2", tableNumber: "C2", category: "Business Table", area: "Business Lounge",capacity: 4, minSpend: 7000,  status: "available", position: [ 3, 0,  0] },

  // VIP Room
  { id: "V1", tableNumber: "V1", category: "VIP Table",     area: "VIP Room",        capacity: 6,  minSpend: 12000, status: "available", position: [ 7, 0, -2] },
  { id: "V2", tableNumber: "V2", category: "VIP Table",     area: "VIP Room",        capacity: 8,  minSpend: 18000, status: "reserved",  position: [ 7, 0,  1] },

  // Private Cabins
  { id: "P1", tableNumber: "P1", category: "Private Room",  area: "Private Cabin",   capacity: 6,  minSpend: 15000, position: [ 3, 0,  3], status: "available" },
  { id: "P2", tableNumber: "P2", category: "Private Room",  area: "Private Dining",  capacity: 10, minSpend: 22000, status: "available", position: [ 0, 0,  4] },

  // Large group
  { id: "L1", tableNumber: "L1", category: "Large Group Table", area: "Indoor Dining", capacity: 12, minSpend: 25000, status: "available", position: [-3, 0,  4] },

  // Outdoor / Garden / Pool
  { id: "O1", tableNumber: "O1", category: "Outdoor Table", area: "Outdoor Seating", capacity: 4, minSpend: 5000,  status: "available", position: [-7, 0,  5] },
  { id: "O2", tableNumber: "O2", category: "Outdoor Table", area: "Outdoor Seating", capacity: 2, minSpend: 3500,  status: "available", position: [-9, 0,  3] },
  { id: "G1", tableNumber: "G1", category: "Garden Table",  area: "Garden",          capacity: 4, minSpend: 5500,  status: "occupied",  position: [-9, 0,  6] },
  { id: "G2", tableNumber: "G2", category: "Garden Table",  area: "Garden",          capacity: 6, minSpend: 7500,  status: "available", position: [-6, 0,  7] },
  { id: "PL1", tableNumber: "PL1", category: "Pool Table",  area: "Pool Side",       capacity: 4, minSpend: 6500,  status: "available", position: [ 7, 0,  5] },
  { id: "PL2", tableNumber: "PL2", category: "Pool Table",  area: "Pool Side",       capacity: 6, minSpend: 9000,  status: "available", position: [ 9, 0,  6] },
];

export interface AreaMarker {
  label: RestaurantArea | string;
  position: [number, number, number];
  color?: string;
}

const areaMarkers: AreaMarker[] = [
  { label: "Luxury Entrance",   position: [ 0, 0, -7] },
  { label: "Reception",          position: [ 0, 0, -5.5] },
  { label: "Waiting Lounge",     position: [-5, 0, -5] },
  { label: "Couple Zone",        position: [-7, 0, -3.2] },
  { label: "Window Side",        position: [-7, 0,  3.2] },
  { label: "Indoor Dining",      position: [-1.5, 0, -3.2] },
  { label: "Family Dining",      position: [-3, 0,  3.2] },
  { label: "Business Lounge",    position: [ 3, 0, -3.2] },
  { label: "VIP Room",           position: [ 7, 0, -3.2] },
  { label: "Wine Cellar",        position: [ 9.5, 0, -1] },
  { label: "Luxury Bar",         position: [ 9.5, 0,  2] },
  { label: "Open Kitchen",       position: [ 5, 0, -6] },
  { label: "Live Music",         position: [-5, 0,  1] },
  { label: "Private Cabin",      position: [ 1.5, 0,  4.2] },
  { label: "Outdoor Seating",    position: [-8, 0,  4.2] },
  { label: "Garden",             position: [-8, 0,  7] },
  { label: "Pool Side",          position: [ 8, 0,  6.5] },
];

export const cameraPresets: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  top:      { position: [0, 18, 1],   target: [0, 0, 1] },
  entrance: { position: [0, 3, -10],  target: [0, 1, 0] },
  garden:   { position: [-8, 4, 11],  target: [-8, 0, 6] },
  vip:      { position: [7, 3.5, 2],  target: [7, 0.5, -1] },
  kitchen:  { position: [5, 3.5, -2], target: [5, 0.5, -6] },
  bar:      { position: [9, 3.5, 5],  target: [9.5, 0.5, 1] },
  reset:    { position: [0, 9, 13],   target: [0, 0, 1] },
};

export const useTableLayout = () => ({ tables, areaMarkers });
