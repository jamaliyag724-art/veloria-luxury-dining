import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit,
  UtensilsCrossed,
} from "lucide-react";

const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
];

type Dish = {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
};

const AdminMenu: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState<Omit<Dish, "id">>({
    name: "",
    price: 0,
    category: "Starters",
    available: true,
  });

  const addDish = () => {
    if (!form.name || !form.price) return;

    setDishes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...form,
      },
    ]);

    setForm({
      name: "",
      price: 0,
      category: "Starters",
      available: true,
    });
  };

  const deleteDish = (id: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] px-8 py-10">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <UtensilsCrossed className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-3xl">Menu Management</h1>
          <p className="text-muted-foreground text-sm">
            Add, update or remove dishes
          </p>
        </div>
      </div>

      {/* ADD DISH */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-border mb-10">
        <h2 className="font-serif text-lg mb-4">Add New Dish</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Dish Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="luxury-input"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="luxury-input"
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="luxury-input"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={addDish}
            className="btn-gold flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Dish
          </motion.button>
        </div>
      </div>

      {/* DISH LIST */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-border">
        <h2 className="font-serif text-lg mb-6">All Dishes</h2>

        {dishes.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-10">
            No dishes added yet
          </p>
        )}

        <div className="space-y-4">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="flex justify-between items-center p-4 bg-[#faf8f4] rounded-2xl"
            >
              <div>
                <p className="font-medium">{dish.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dish.category} • ₹{dish.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    dish.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {dish.available ? "Available" : "Unavailable"}
                </span>

                <button
                  onClick={() => deleteDish(dish.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
