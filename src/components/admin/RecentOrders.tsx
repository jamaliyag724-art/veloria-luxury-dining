import React from "react";
import { Order } from "@/context/OrderContext";

interface Props {
  orders?: Order[];
}

const RecentOrders: React.FC<Props> = ({ orders }) => {

  const safeOrders = orders ?? [];

  const recent = [...safeOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  return (

    <div className="bg-card border border-border rounded-2xl p-7">

      <h2 className="font-serif text-lg mb-6">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-muted-foreground">

            <tr>
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Items</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-left pb-3">Status</th>
            </tr>

          </thead>

          <tbody>

            {recent.map(order => (

              <tr key={order.orderId} className="border-t border-border">

                <td className="py-3">
                  {order.fullName}
                </td>

                <td>
                  {order.items.length}
                </td>

                <td>
                  ₹{order.totalAmount}
                </td>

                <td>

                  <span className="px-2 py-1 rounded-lg text-xs bg-primary/10 text-primary">
                    {order.paymentStatus}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default RecentOrders;
