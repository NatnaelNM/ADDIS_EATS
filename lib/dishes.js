/**
 * Menu data for the Addis Eats classroom project.
 * Image URLs point to photographs of the named Ethiopian dish, not generic food.
 */
export const dishes = [
  {
    id: "doro",
    name: "Doro Wot",
    category: "Main",
    description:
      "Traditional chicken stew simmered in berbere with boiled egg, served with injera.",
    price: 520,
    image:
      "https://www.arise-app.com/images/dishes/en/ethiopian-doro-wat-with-injera-and-awaze-14eion.webp",
    imageCredit: "Arise — Ethiopian Doro Wat with Injera and Awaze",
  },
  {
    id: "tibs",
    name: "Beef Tibs",
    category: "Main",
    description:
      "Tender sautéed beef with onion, peppers, rosemary, and Ethiopian spices.",
    price: 450,
    image: "https://harambeeafrica.com/wp-content/uploads/2023/11/Tibs-with-injera1.jpg",
    imageCredit: "Harambee Africa — Ethiopian Beef Tibs with Injera",
  },
  {
    id: "kitfo",
    name: "Kitfo",
    category: "Main",
    description:
      "A classic minced beef dish seasoned with mitmita and spiced Ethiopian butter.",
    price: 420,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/b2/83/f6/tiru-kitfo.jpg?h=1200&s=1&w=1200",
    imageCredit: "Tiru Kitfo — traditional Kitfo platter",
  },
  {
    id: "shiro",
    name: "Shiro Wot",
    category: "Stew",
    description:
      "Silky chickpea stew with berbere, garlic, and slow-cooked onion.",
    price: 280,
    image:
      "https://d1w7312wesee68.cloudfront.net/4zCbBTb2qxl-frFJ80AuNQgJC42_hiZMp1xGqnmy744/resize%3Afit%3A720%3A720/plain/s3%3A/toasttab/restaurants/restaurant-278975000000000000/menu/items/4/item-1400000000713119844_1758326298.jpg",
    imageCredit: "Bahel Restaurant — Bozena Shiro served with injera",
  },
  {
    id: "beyaynet",
    name: "Yetsom Beyaynetu",
    category: "Vegetarian",
    description:
      "A colorful fasting platter of Ethiopian vegetable stews, greens, lentils, and injera.",
    price: 360,
    image:
      "https://www.tastingtable.com/img/gallery/ethiopian-beyaynetu-is-a-must-try-for-those-who-like-variety-in-one-dish/l-intro-1694189612.jpg",
    imageCredit: "Tasting Table — Ethiopian Beyaynetu platter",
  },
  {
    id: "gomen",
    name: "Gomen",
    category: "Vegetarian",
    description:
      "Collard greens gently cooked with onion, garlic, ginger, and warm spices.",
    price: 220,
    image:
      "https://assets.nourishingmeals.com/sites/default/files/styles/poster/public/media/INDIAN%20SPICED%20DARK%20LEAFY%20GREENS-1.jpg?h=462a907e",
    imageCredit: "Nourishing Meals — Ethiopian collard greens",
  },
  {
    id: "firfir",
    name: "Firfir",
    category: "Breakfast",
    description:
      "Soft pieces of injera tossed in a rich, spicy berbere and tomato sauce.",
    price: 260,
    image:
      "https://i0.wp.com/bittersweetblog.com/wp-content/uploads/2025/09/Firfir.jpg?resize=720%2C720&ssl=1",
    imageCredit: "BitterSweet — Ethiopian firfir",
  },
  {
    id: "chechebsa",
    name: "Chechebsa",
    category: "Breakfast",
    description:
      "Torn flatbread tossed in spiced butter and berbere, served as a breakfast favorite.",
    price: 240,
    image:
      "https://cupofyum.com/uploads/images/000/070/662/70662-chechebsa-ethiopian-torn-flatbread-breakfast-947616e4ed65fef6f94b95174e7c6793.jpg",
    imageCredit: "Cup of Yum — Chechebsa breakfast plate",
  },
  {
    id: "misir",
    name: "Misir Wot",
    category: "Vegetarian",
    description:
      "Red lentils simmered with berbere, garlic, ginger, and caramelized onion.",
    price: 250,
    image:
      "https://nutriscan.app/calories-nutrition/images/misir-wat-58de6.webp",
    imageCredit: "NutriScan — Misir Wat red lentil stew",
  },
  {
    id: "atkilt",
    name: "Atkilt Wot",
    category: "Vegetarian",
    description:
      "A mild, comforting stew of cabbage, potato, carrot, and turmeric.",
    price: 230,
    image:
      "https://tkpe6wrwxmgsladx.public.blob.vercel-storage.com/recipes/ethiopian-atakilt.jpg",
    imageCredit: "World Food — Atkilt Wat",
  },
  {
    id: "sambusa",
    name: "Lentil Sambusa",
    category: "Starter",
    description:
      "Crisp triangular pastry filled with seasoned lentils and served with dipping sauce.",
    price: 140,
    image: "https://restaurantmerhaba.ch/assets/menu-sambusa-XWv3Rlnj.jpg",
    imageCredit: "Merhaba Restaurant — lentil sambusa",
  },
  {
    id: "buna",
    name: "Buna (Ethiopian Coffee)",
    category: "Drink",
    description:
      "Strong, aromatic Ethiopian coffee inspired by the traditional buna ceremony.",
    price: 90,
    image:
      "https://static.wixstatic.com/media/62de5f_8dfa48c98f0f4a4e8af7cf5d708c5e07~mv2.png/v1/fill/w_1000%2Ch_614%2Cal_c%2Cusm_0.66_1.00_0.01/62de5f_8dfa48c98f0f4a4e8af7cf5d708c5e07~mv2.png",
    imageCredit: "Desta 100 — Ethiopian coffee ceremony",
  },
];

export function getDish(id) {
  return dishes.find((dish) => dish.id === id);
}

export function getDishOrderLines(items) {
  if (!Array.isArray(items)) return null;

  const normalized = [];

  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    ) {
      return null;
    }

    const dish = getDish(item.id);

    if (!dish) return null;

    const existing = normalized.find((line) => line.id === dish.id);

    if (existing) {
      existing.quantity += item.quantity;
      if (existing.quantity > 50) return null;
      existing.lineTotal = dish.price * existing.quantity;
    } else {
      normalized.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: item.quantity,
        lineTotal: dish.price * item.quantity,
      });
    }
  }

  if (normalized.length === 0) return null;

  return {
    items: normalized,
    total: normalized.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}
