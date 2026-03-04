import React from "react";

const insights = [
  {
    title: "Peak Revenue Time",
    description: "Most revenue is generated between 7PM - 9PM."
  },
  {
    title: "Top Dish",
    description: "Truffle Burrata is currently the most ordered item."
  },
  {
    title: "Customer Pattern",
    description: "Weekend reservations are 35% higher than weekdays."
  }
];

const AIInsights = () => {

  return (

    <div className="grid md:grid-cols-3 gap-6">

      {insights.map((item, index) => (

        <div
          key={index}
          className="bg-card border rounded-xl p-6 hover:border-yellow-500 transition"
        >

          <h3 className="text-lg font-semibold mb-2">
            {item.title}
          </h3>

          <p className="text-muted-foreground text-sm">
            {item.description}
          </p>

        </div>

      ))}

    </div>

  );

};

export default AIInsights;
