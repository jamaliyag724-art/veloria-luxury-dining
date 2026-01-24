export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  dietary?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
}

export const menuCategories: MenuCategory[] = [
  { id: 'starters', name: 'Starters', description: 'Begin your culinary journey' },
  { id: 'brunch', name: 'Brunch', description: 'Weekend indulgence' },
  { id: 'lunch', name: 'Lunch', description: 'Midday elegance' },
  { id: 'main-course', name: 'Main Course', description: 'Signature creations' },
  { id: 'desserts', name: 'Desserts', description: 'Sweet finales' },
  { id: "wine-beverages", name: 'Wine & Beverages', description: 'Curated selections' },
];

export const menuItems: MenuItem[] = [
  // STARTERS (15 items)
  { id: 's1', name: 'Truffle Burrata', description: 'Creamy burrata with black truffle shavings, heirloom tomatoes, and aged balsamic', price: 24, image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400', category: 'starters', featured: true },
  { id: 's2', name: 'Seared Foie Gras', description: 'Pan-seared foie gras with brioche, fig compote, and port reduction', price: 38, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'starters' },
  { id: 's3', name: 'Oyster Selection', description: 'Six premium oysters with champagne mignonette and lemon', price: 32, image: 'file:///Users/Gaurang/Downloads/oyster.png?w=400', category: 'starters' },
  { id: 's4', name: 'Tuna Tartare', description: 'Fresh yellowfin tuna with avocado mousse, sesame, and wasabi aioli', price: 28, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', category: 'starters' },
  { id: 's5', name: 'Lobster Bisque', description: 'Velvety lobster soup with cognac cream and chive oil', price: 22, image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400', category: 'starters' },
  { id: 's6', name: 'Beef Carpaccio', description: 'Thinly sliced wagyu with arugula, parmesan, and truffle oil', price: 26, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400', category: 'starters' },
  { id: 's7', name: 'Scallop Crudo', description: 'Raw scallops with citrus, jalapeño, and micro herbs', price: 30, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400', category: 'starters' },
  { id: 's8', name: 'Wild Mushroom Soup', description: 'Porcini and chanterelle bisque with truffle foam', price: 18, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', category: 'starters', dietary: ['vegetarian'] },
  { id: 's9', name: 'Crab Cakes', description: 'Jumbo lump crab with remoulade and microgreens', price: 28, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400', category: 'starters' },
  { id: 's10', name: 'Prawn Cocktail', description: 'Chilled tiger prawns with classic cocktail sauce', price: 24, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', category: 'starters' },
  { id: 's11', name: 'Goat Cheese Salad', description: 'Warm goat cheese with beets, walnuts, and honey vinaigrette', price: 19, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: 'starters', dietary: ['vegetarian'] },
  { id: 's12', name: 'Asparagus Velouté', description: 'Spring asparagus soup with crème fraîche and hazelnuts', price: 17, image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400', category: 'starters', dietary: ['vegetarian'] },
  { id: 's13', name: 'Duck Rillettes', description: 'Slow-cooked duck with cornichons and toasted brioche', price: 21, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', category: 'starters' },
  { id: 's14', name: 'Salmon Gravlax', description: 'House-cured salmon with dill cream and capers', price: 23, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', category: 'starters' },
  { id: 's15', name: 'Artichoke Hearts', description: 'Grilled artichokes with lemon aioli and herbs', price: 16, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: 'starters', dietary: ['vegan'] },

  // BRUNCH (15 items)
  { id: 'b1', name: 'Eggs Royale', description: 'Poached eggs with smoked salmon, hollandaise on brioche', price: 26, image: 'https://images.unsplash.com/photo-1608039829572-9f68dd24a7fe?w=400', category: 'brunch', featured: true },
  { id: 'b2', name: 'Truffle Scrambled Eggs', description: 'Soft scrambled eggs with black truffle and chives', price: 28, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', category: 'brunch' },
  { id: 'b3', name: 'French Toast Royale', description: 'Brioche french toast with berries and maple crème', price: 22, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400', category: 'brunch' },
  { id: 'b4', name: 'Avocado Toast Deluxe', description: 'Sourdough with avocado, poached eggs, and dukkah', price: 20, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', category: 'brunch', dietary: ['vegetarian'] },
  { id: 'b5', name: 'Lobster Omelette', description: 'Three-egg omelette with lobster and gruyère', price: 38, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400', category: 'brunch' },
  { id: 'b6', name: 'Shakshuka', description: 'Baked eggs in spiced tomato sauce with feta', price: 19, image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400', category: 'brunch', dietary: ['vegetarian'] },
  { id: 'b7', name: 'Croque Madame', description: 'Classic ham and cheese with béchamel and fried egg', price: 21, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', category: 'brunch' },
  { id: 'b8', name: 'Smoked Salmon Bagel', description: 'Fresh bagel with cream cheese, capers, and salmon', price: 24, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400', category: 'brunch' },
  { id: 'b9', name: 'Pancake Stack', description: 'Fluffy buttermilk pancakes with berries and whipped cream', price: 18, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', category: 'brunch' },
  { id: 'b10', name: 'Eggs Florentine', description: 'Poached eggs with spinach, hollandaise on english muffin', price: 22, image: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=400', category: 'brunch', dietary: ['vegetarian'] },
  { id: 'b11', name: 'Steak & Eggs', description: 'Wagyu steak with sunny-side eggs and truffle fries', price: 42, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', category: 'brunch' },
  { id: 'b12', name: 'Belgian Waffles', description: 'Crispy waffles with strawberries and chantilly cream', price: 19, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400', category: 'brunch' },
  { id: 'b13', name: 'Açaí Bowl', description: 'Organic açaí with granola, fresh fruits, and honey', price: 17, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', category: 'brunch', dietary: ['vegan'] },
  { id: 'b14', name: 'Mediterranean Plate', description: 'Hummus, falafel, labneh, and warm pita bread', price: 23, image: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=400', category: 'brunch', dietary: ['vegetarian'] },
  { id: 'b15', name: 'Brioche Burger', description: 'Wagyu patty with aged cheddar and truffle aioli', price: 32, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'brunch' },

  // LUNCH (15 items)
  { id: 'l1', name: 'Niçoise Salad', description: 'Seared tuna with olives, eggs, and anchovy dressing', price: 28, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', category: 'lunch' },
  { id: 'l2', name: 'Lobster Roll', description: 'Maine lobster in buttered brioche with herb aioli', price: 42, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', category: 'lunch', featured: true },
  { id: 'l3', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, and classic dressing', price: 19, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category: 'lunch' },
  { id: 'l4', name: 'Club Sandwich', description: 'Triple-decker with turkey, bacon, and avocado', price: 24, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', category: 'lunch' },
  { id: 'l5', name: 'Grilled Salmon', description: 'Atlantic salmon with quinoa and citrus butter', price: 34, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'lunch' },
  { id: 'l6', name: 'Truffle Risotto', description: 'Arborio rice with wild mushrooms and truffle', price: 32, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', category: 'lunch', dietary: ['vegetarian'] },
  { id: 'l7', name: 'Caprese Panini', description: 'Fresh mozzarella, tomato, and basil pesto', price: 18, image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400', category: 'lunch', dietary: ['vegetarian'] },
  { id: 'l8', name: 'Seafood Linguine', description: 'Fresh pasta with prawns, clams, and white wine', price: 36, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', category: 'lunch' },
  { id: 'l9', name: 'Chicken Paillard', description: 'Pounded chicken breast with arugula salad', price: 26, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400', category: 'lunch' },
  { id: 'l10', name: 'Tuna Melt', description: 'Albacore tuna with swiss on sourdough', price: 22, image: 'https://images.unsplash.com/photo-1485451456034-3f9391c6f769?w=400', category: 'lunch' },
  { id: 'l11', name: 'Quinoa Buddha Bowl', description: 'Roasted vegetables, chickpeas, and tahini', price: 21, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: 'lunch', dietary: ['vegan'] },
  { id: 'l12', name: 'Beef Bourguignon', description: 'Slow-braised beef in red wine with vegetables', price: 38, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', category: 'lunch' },
  { id: 'l13', name: 'Duck Confit Salad', description: 'Crispy duck leg with frisée and poached egg', price: 29, image: 'https://images.unsplash.com/photo-1580554530778-ca36943571e6?w=400', category: 'lunch' },
  { id: 'l14', name: 'Margherita Flatbread', description: 'San Marzano tomatoes, mozzarella, and basil', price: 20, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: 'lunch', dietary: ['vegetarian'] },
  { id: 'l15', name: 'Cobb Salad', description: 'Chicken, bacon, avocado, blue cheese, and egg', price: 25, image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400', category: 'lunch' },

  // MAIN COURSE (15 items)
  { id: 'm1', name: 'Wagyu Ribeye', description: 'A5 wagyu with bone marrow butter and roasted garlic', price: 145, image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400', category: 'main-course', featured: true },
  { id: 'm2', name: 'Lobster Thermidor', description: 'Whole lobster with creamy cognac sauce and gratin', price: 85, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400', category: 'main-course' },
  { id: 'm3', name: 'Duck à l\'Orange', description: 'Roasted duck breast with citrus glaze and fondant potato', price: 52, image: 'https://images.unsplash.com/photo-1580554530778-ca36943571e6?w=400', category: 'main-course' },
  { id: 'm4', name: 'Filet Mignon', description: 'Prime beef tenderloin with red wine reduction', price: 68, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', category: 'main-course' },
  { id: 'm5', name: 'Rack of Lamb', description: 'Herb-crusted lamb with rosemary jus and ratatouille', price: 58, image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=400', category: 'main-course' },
  { id: 'm6', name: 'Dover Sole Meunière', description: 'Whole Dover sole with brown butter and capers', price: 72, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', category: 'main-course' },
  { id: 'm7', name: 'Osso Buco', description: 'Braised veal shank with gremolata and saffron risotto', price: 54, image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', category: 'main-course' },
  { id: 'm8', name: 'Black Cod Miso', description: 'Miso-glazed Chilean sea bass with bok choy', price: 62, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'main-course' },
  { id: 'm9', name: 'Beef Wellington', description: 'Prime beef wrapped in mushroom duxelles and puff pastry', price: 78, image: 'https://images.unsplash.com/photo-1607198179219-cd8b835fdda7?w=400', category: 'main-course' },
  { id: 'm10', name: 'Coq au Vin', description: 'Braised chicken in burgundy wine with pearl onions', price: 42, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', category: 'main-course' },
  { id: 'm11', name: 'Seafood Paella', description: 'Spanish rice with lobster, prawns, and saffron', price: 64, image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400', category: 'main-course' },
  { id: 'm12', name: 'Veal Piccata', description: 'Tender veal with lemon caper sauce and linguine', price: 46, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400', category: 'main-course' },
  { id: 'm13', name: 'Grilled Branzino', description: 'Mediterranean sea bass with olive tapenade', price: 48, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', category: 'main-course' },
  { id: 'm14', name: 'Mushroom Risotto', description: 'Wild mushroom risotto with truffle and parmesan', price: 38, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', category: 'main-course', dietary: ['vegetarian'] },
  { id: 'm15', name: 'Tomahawk Steak', description: '32oz bone-in ribeye for two, dry-aged 45 days', price: 165, image: 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=400', category: 'main-course' },

  // DESSERTS (15 items)
  { id: 'd1', name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar', price: 14, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400', category: 'desserts', featured: true },
  { id: 'd2', name: 'Chocolate Soufflé', description: 'Warm dark chocolate soufflé with vanilla ice cream', price: 18, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400', category: 'desserts' },
  { id: 'd3', name: 'Tarte Tatin', description: 'Caramelized apple tart with crème fraîche', price: 15, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a7?w=400', category: 'desserts' },
  { id: 'd4', name: 'Tiramisu', description: 'Espresso-soaked ladyfingers with mascarpone', price: 14, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: 'desserts' },
  { id: 'd5', name: 'Lemon Tart', description: 'Tangy lemon curd in buttery shortbread crust', price: 13, image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400', category: 'desserts' },
  { id: 'd6', name: 'Profiteroles', description: 'Choux pastry with vanilla ice cream and chocolate', price: 15, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400', category: 'desserts' },
  { id: 'd7', name: 'Panna Cotta', description: 'Silky Italian custard with berry compote', price: 12, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', category: 'desserts' },
  { id: 'd8', name: 'Molten Lava Cake', description: 'Warm chocolate cake with liquid center', price: 16, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category: 'desserts' },
  { id: 'd9', name: 'Cheesecake', description: 'New York style with graham crust and berries', price: 14, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400', category: 'desserts' },
  { id: 'd10', name: 'Affogato', description: 'Espresso poured over vanilla gelato', price: 10, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400', category: 'desserts' },
  { id: 'd11', name: 'Mille-Feuille', description: 'Layered puff pastry with vanilla cream', price: 16, image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=400', category: 'desserts' },
  { id: 'd12', name: 'Crêpes Suzette', description: 'French crêpes with orange butter and Grand Marnier', price: 18, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400', category: 'desserts' },
  { id: 'd13', name: 'Gelato Trio', description: 'Three scoops of artisan Italian gelato', price: 12, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400', category: 'desserts' },
  { id: 'd14', name: 'Chocolate Truffle Cake', description: 'Rich flourless chocolate cake with gold leaf', price: 17, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: 'desserts' },
  { id: 'd15', name: 'Fruit Pavlova', description: 'Crisp meringue with cream and seasonal fruits', price: 15, image: 'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=400', category: 'desserts' },

 // WINE & BEVERAGES (15 items)
{
  id: "w1",
  name: "Dom Pérignon 2012",
  description: "Champagne, France - Elegant with citrus and brioche notes",
  price: 420,
  image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800",
  category: "wine-beverages",
  featured: true,
},
{
  id: "w2",
  name: "Château Margaux 2015",
  description: "Bordeaux, France - Full-bodied with cassis and cedar",
  price: 850,
  image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800",
  category: "wine-beverages",
},
{
  id: "w3",
  name: "Opus One 2018",
  description: "Napa Valley, USA - Rich blend of Cabernet and Merlot",
  price: 550,
  image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
  category: "wine-beverages",
},
{
  id: "w4",
  name: "Cloudy Bay Sauvignon Blanc",
  description: "Marlborough, NZ - Crisp with tropical fruit notes",
  price: 68,
  image: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=800",
  category: "wine-beverages",
},
{
  id: "w5",
  name: "Amarone della Valpolicella",
  description: "Veneto, Italy - Intense with dried fruit complexity",
  price: 145,
  image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800",
  category: "wine-beverages",
},
{
  id: "w6",
  name: "Classic Martini",
  description: "Grey Goose vodka or Tanqueray gin with dry vermouth",
  price: 22,
  image: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?w=800",
  category: "wine-beverages",
},
{
  id: "w7",
  name: "Old Fashioned",
  description: "Woodford Reserve bourbon with bitters and orange",
  price: 24,
  image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800",
  category: "wine-beverages",
},
{
  id: "w8",
  name: "Negroni",
  description: "Campari, gin, and sweet vermouth with orange twist",
  price: 20,
  image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800",
  category: "wine-beverages",
},
{
  id: "w9",
  name: "Whiskey Sour",
  description: "Bulleit bourbon with lemon and egg white foam",
  price: 18,
  image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800",
  category: "wine-beverages",
},
{
  id: "w10",
  name: "Espresso",
  description: "Double shot of Italian espresso",
  price: 6,
  image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800",
  category: "wine-beverages",
},
{
  id: "w11",
  name: "Cappuccino",
  description: "Espresso with steamed milk and foam",
  price: 8,
  image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800",
  category: "wine-beverages",
},
{
  id: "w12",
  name: "Artisan Tea Selection",
  description: "Premium loose-leaf teas from around the world",
  price: 10,
  image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
  category: "wine-beverages",
},
{
  id: "w13",
  name: "Fresh Juice",
  description: "Orange, grapefruit, or green juice blend",
  price: 12,
  image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800",
  category: "wine-beverages",
},
{
  id: "w14",
  name: "Sparkling Water",
  description: "San Pellegrino or Acqua Panna",
  price: 8,
  image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800",
  category: "wine-beverages",
},
{
  id: "w15",
  name: "Mocktail Selection",
  description: "Virgin mojito, berry fizz, or ginger spritz",
  price: 14,
  image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800",
  category: "wine-beverages",
},
];

export const getFeaturedItems = () => menuItems.filter((item) => item.featured);
export const getItemsByCategory = (category: string) => menuItems.filter((item) => item.category === category);
