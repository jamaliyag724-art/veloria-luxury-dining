import React, { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { nanoid } from "nanoid";

const AdminMenu = () => {
  const { addItem } = useMenu();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "main-course",
  });

  const handleSubmit = () => {
    addItem({
      id: nanoid(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      available: true,
    });

    setForm({ name: "", description: "", price: "", category: "main-course" });
  };

  return (
    <div className="max-w-xl">
      <input
        placeholder="Dish Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="luxury-input"
      />
      <input
        placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
        className="luxury-input"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="luxury-input"
      />
      <button onClick={handleSubmit} className="btn-gold mt-4">
        Add Dish
      </button>
    </div>
  );
};

export default AdminMenu;
