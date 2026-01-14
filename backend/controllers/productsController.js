let products = [
  // 🥤 ENERGIDRYCK (NOCCO)
  { id: 1, name: "NOCCO Raspberry Blast", category: "Energidryck", price: 29, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8il6Mc_kcOzOUW2wCiIQPvLbbO7PgZUHeGg&s", tagColor: "#22c55e" },
  { id: 2, name: "NOCCO Ramonade", category: "Energidryck", price: 29, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJqGDWpm1wjmLbolHgKcFzWiZUeL01nFSEmw&s", tagColor: "#22c55e" },

  // 🥛 PROTEINPULVER (Myprotein)
  { id: 3, name: "Whey Protein Vanilj", category: "Proteinpulver", price: 299, imageUrl: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dw8e108baa/Nya_produktbilder/Star_Nutrition/585R_Starnutrition_Whey80_Vanilla_1kg_Feb20.jpg?sw=655&sh=655&sm=fit&sfrm=png", tagColor: "#3b82f6" },
  { id: 4, name: "Whey Protein Choklad", category: "Proteinpulver", price: 299, imageUrl: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dw96d9f895/Nya_produktbilder/Star_Nutrition/585R_Starnutrition_Whey80_Chocolate_1kg_Feb20.jpg?sw=655&sh=655&sm=fit&sfrm=png", tagColor: "#3b82f6" },
  { id: 5, name: "Ultimate Vegan Protein", category: "Proteinpulver", price: 319, imageUrl: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dw32288337/media/GG-Produktbilder/Star-Nutrition/6857-1_UltimateVeganProtein-Chocolate-1kg_0823.jpg?sw=655&sh=655&sm=fit&sfrm=png", tagColor: "#3b82f6" },
  { id: 6, name: "Casein Gold Standard", category: "Proteinpulver", price: 349, imageUrl: "https://cdn.mmsports.se/resized/product-zoom/D/ON-Gold-Standard-Casein-Vanilla-1%2C8kg.jpg", tagColor: "#3b82f6" },

  // 💊 KOSTTILLSKOTT (Myvitamins/Myprotein)
  { id: 7, name: "Daily Multivitamin", category: "Kosttillskott", price: 129, imageUrl: "https://www.sportkost.se/pub_images/original/north_nutrition_multivitamin.jpg", tagColor: "#8b5cf6" },
  { id: 8, name: "A-Z Multivitamin", category: "Kosttillskott", price: 139, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt5jIUgrVICLxtAk2kC1zzetaXS5my1aowAw&s", tagColor: "#8b5cf6" },
  { id: 9, name: "Vitamin D3", category: "Kosttillskott", price: 99, imageUrl: "https://www.myprotein.se/images?url=https://static.thcdn.com/productimg/original/13527718-2075140071679704.jpg&format=webp&auto=avif&crop=1100,1200,smart", tagColor: "#8b5cf6" },
  { id: 10, name: "Omega 3", category: "Kosttillskott", price: 149, imageUrl: "https://www.livemomentous.com/cdn/shop/files/V1_Omega-3-Bottle_2000x2000_FEB142025_CC.png?v=1740008075&width=2000", tagColor: "#8b5cf6" },
  { id: 11, name: "Creatine Monohydrate", category: "Kosttillskott", price: 199, imageUrl: "https://ansupps.com/cdn/shop/files/USA-Creatine-Monohydrate-300g-Unflavored-Front.png?v=1766290352", tagColor: "#8b5cf6" },
  { id: 12, name: "BCAA Vanilla Pear", category: "Kosttillskott", price: 189, imageUrl: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dwd252ac7b/Nya_produktbilder/Star_Nutrition/6692R_Star-Nutrition_Supreme-BCAA-vanilla-pear-ice-cream_250g_Maj20.jpg?sw=655&sh=655&sm=fit&sfrm=png", tagColor: "#8b5cf6" },
  { id: 13, name: "BCAA Lime Citron", category: "Kosttillskott", price: 199, imageUrl: "https://assets.icanet.se/image/upload/cs_srgb/t_product_large_2x_v1/v1668793289/qbdycuohpts5v81ff19c.webp", tagColor: "#8b5cf6" },
  { id: 14, name: "Pre-Workout Tropical Fruits", category: "Kosttillskott", price: 249, imageUrl: "https://assets.icanet.se/image/upload/cs_srgb/t_product_large_2x_v1/vzcamrrxmzm5las1ndff.webp", tagColor: "#8b5cf6" },
  { id: 15, name: "Pre-Workout Fresh Forest Berry", category: "Kosttillskott", price: 229, imageUrl: "https://www.gymgrossisten.com/dw/image/v2/BDJH_PRD/on/demandware.static/-/Sites-hsng-master-catalog/default/dw3956aa53/media/GG-Produktbilder/Gymgrossisten/6677R.berry.png?sw=593&sh=593&sm=fit&sfrm=png", tagColor: "#8b5cf6" },
];




// GET /products
const getAllProducts = (req, res) => {
  res.json(products);
};

// GET /products/:id
const getOneProduct = (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: "Produkten hittades inte" });
  res.json(product);
};

// POST /products
const createProduct = (req, res) => {
  const { name, category, price, imageUrl, stock, tagColor } = req.body || {};

  if (!name || !category) {
    return res.status(400).json({ message: "name och category krävs" });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name: String(name),
    category: String(category),
    price: Number(price) || 0,
    imageUrl: String(imageUrl || ""),
    stock: Number(stock) || 0,
    tagColor: String(tagColor || "#22c55e"),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

// PUT /products  (frontend skickar id i body)
const updateProduct = (req, res) => {
  const { id, name, category, price, imageUrl, stock, tagColor } = req.body || {};

  if (!id) return res.status(400).json({ message: "id måste finnas i body" });

  const product = products.find(p => p.id === Number(id));
  if (!product) return res.status(404).json({ message: "Produkten hittades inte" });

  if (name !== undefined) product.name = String(name);
  if (category !== undefined) product.category = String(category);
  if (price !== undefined) product.price = Number(price) || 0;
  if (imageUrl !== undefined) product.imageUrl = String(imageUrl || "");
  if (stock !== undefined) product.stock = Number(stock) || 0;
  if (tagColor !== undefined) product.tagColor = String(tagColor || product.tagColor);

  res.json(product);
};

// DELETE /products/:id
const deleteProduct = (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ message: "Produkten hittades inte" });

  const removed = products.splice(index, 1)[0];
  res.json({ message: "Produkten borttagen", removed });
};

module.exports = { getAllProducts, getOneProduct, createProduct, updateProduct, deleteProduct };
