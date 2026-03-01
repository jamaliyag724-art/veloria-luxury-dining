import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { formatINR } from "@/lib/currency";
import { menuItems, MenuItem } from "@/data/menuData";
import LuxuryDishCard from "@/components/ui/LuxuryDishCard";

interface RecommendedDishesProps {
  onAddToCart?: (item: MenuItem) => void;
}

const getRecommendations = (
  orders: { items: { id: string; name: string; quantity: number }[] }[],
  allItems: MenuItem[],
  limit = 6
): MenuItem[] => {
  // Count how often each item is ordered
  const popularity = new Map<string, number>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      popularity.set(item.id, (popularity.get(item.id) || 0) + item.quantity);
    });
  });

  // Find frequently co-ordered items (simple association)
  const coOrdered = new Map<string, Set<string>>();
  orders.forEach((order) => {
    const ids = order.items.map((i) => i.id);
    ids.forEach((id) => {
      if (!coOrdered.has(id)) coOrdered.set(id, new Set());
      ids.forEach((otherId) => {
        if (otherId !== id) coOrdered.get(id)!.add(otherId);
      });
    });
  });

  // Score each item
  const scored = allItems.map((item) => {
    const popScore = popularity.get(item.id) || 0;
    const coScore = coOrdered.get(item.id)?.size || 0;
    const featuredBonus = item.featured ? 3 : 0;
    return { item, score: popScore * 2 + coScore + featuredBonus };
  });

  // Sort by score descending, take top items
  scored.sort((a, b) => b.score - a.score);

  // If no order history, return featured items
  if (orders.length === 0) {
    return allItems.filter((i) => i.featured).slice(0, limit);
  }

  return scored.slice(0, limit).map((s) => s.item);
};

const RecommendedDishes: React.FC<RecommendedDishesProps> = ({ onAddToCart }) => {
  const { orders } = useOrders();

  const recommendations = useMemo(
    () => getRecommendations(orders, menuItems),
    [orders]
  );

  if (recommendations.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-medium uppercase tracking-widest">
              Chef's Intelligence
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Recommended For You
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Curated selections based on popular choices and trending combinations
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <LuxuryDishCard
                title={item.name}
                description={item.description}
                price={formatINR(item.price)}
                image={item.image}
                onAddToCart={() => onAddToCart?.(item)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedDishes;
