import React from "react";

const customers = [
  { name: "Aarav Patel", orders: 18, spent: 4200 },
  { name: "Riya Shah", orders: 14, spent: 3600 },
  { name: "Kabir Mehta", orders: 11, spent: 2800 },
  { name: "Neha Desai", orders: 9, spent: 2100 }
];

const TopCustomers = () => {

  return (

    <div className="bg-card border rounded-xl p-6">

      <h2 className="text-xl font-serif mb-6">
        Top Customers
      </h2>

      <div className="space-y-4">

        {customers.map((c, i) => (

          <div
            key={i}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-medium">
                {c.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {c.orders} orders
              </p>

            </div>

            <span className="font-semibold">
              ₹{c.spent}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default TopCustomers;
