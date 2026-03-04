import React from "react";

const customers = [
  {
    name: "Aarav Patel",
    orders: 18,
    spent: 4200,
    lastVisit: "2 days ago",
  },
  {
    name: "Riya Shah",
    orders: 14,
    spent: 3600,
    lastVisit: "5 days ago",
  },
  {
    name: "Kabir Mehta",
    orders: 11,
    spent: 2800,
    lastVisit: "1 week ago",
  },
  {
    name: "Neha Desai",
    orders: 9,
    spent: 2100,
    lastVisit: "2 weeks ago",
  },
];

const CustomersSection = () => {
  return (
    <div className="space-y-10">

      <h1 className="text-2xl font-serif">
        Customer Analytics
      </h1>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-6">
          <p className="text-sm text-gray-400">
            Total Customers
          </p>

          <h2 className="text-2xl mt-2">
            124
          </h2>
        </div>

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-6">
          <p className="text-sm text-gray-400">
            Returning Customers
          </p>

          <h2 className="text-2xl mt-2">
            78
          </h2>
        </div>

        <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-6">
          <p className="text-sm text-gray-400">
            Avg Customer Spend
          </p>

          <h2 className="text-2xl mt-2 text-[#d4af37]">
            ₹320
          </h2>
        </div>

      </div>

      {/* Top Customers Table */}

      <div className="bg-[#121214] border border-[#1f1f23] rounded-2xl p-7">

        <h2 className="text-lg mb-6">
          Top Customers
        </h2>

        <table className="w-full text-sm">

          <thead className="text-gray-400">

            <tr>
              <th className="text-left pb-4">Customer</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Last Visit</th>
            </tr>

          </thead>

          <tbody>

            {customers.map((c, index) => (
              <tr
                key={index}
                className="border-t border-[#1f1f23]"
              >

                <td className="py-4">
                  {c.name}
                </td>

                <td>
                  {c.orders}
                </td>

                <td className="text-[#d4af37]">
                  ₹{c.spent}
                </td>

                <td className="text-gray-400">
                  {c.lastVisit}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default CustomersSection;
