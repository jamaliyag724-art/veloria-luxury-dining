export interface TableData {
  id: string;
  tableNumber: number;
  position: [number, number, number];
  isReserved: boolean;
  capacity: number;
}

const tables: TableData[] = [
  // Main dining area — center cluster
  { id: "t1", tableNumber: 1, position: [-3.5, 0, -2], isReserved: false, capacity: 2 },
  { id: "t2", tableNumber: 2, position: [-1.2, 0, -2], isReserved: true, capacity: 4 },
  { id: "t3", tableNumber: 3, position: [1.2, 0, -2], isReserved: false, capacity: 4 },
  { id: "t4", tableNumber: 4, position: [3.5, 0, -2], isReserved: false, capacity: 2 },

  // Middle row
  { id: "t5", tableNumber: 5, position: [-3.5, 0, 0.5], isReserved: true, capacity: 6 },
  { id: "t6", tableNumber: 6, position: [-1.2, 0, 0.5], isReserved: false, capacity: 4 },
  { id: "t7", tableNumber: 7, position: [1.2, 0, 0.5], isReserved: false, capacity: 4 },
  { id: "t8", tableNumber: 8, position: [3.5, 0, 0.5], isReserved: true, capacity: 2 },

  // Back row — window side
  { id: "t9", tableNumber: 9, position: [-2.5, 0, 3], isReserved: false, capacity: 6 },
  { id: "t10", tableNumber: 10, position: [0, 0, 3], isReserved: false, capacity: 8 },
  { id: "t11", tableNumber: 11, position: [2.5, 0, 3], isReserved: false, capacity: 6 },

  // VIP corner
  { id: "t12", tableNumber: 12, position: [-4.5, 0, 5], isReserved: false, capacity: 2 },
  { id: "t13", tableNumber: 13, position: [4.5, 0, 5], isReserved: true, capacity: 2 },
];

export const useTableLayout = () => {
  return { tables };
};
