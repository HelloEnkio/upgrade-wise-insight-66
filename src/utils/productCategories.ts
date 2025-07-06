
export const productCategories = {
  'electronics': ['macbook', 'iphone', 'samsung', 'laptop', 'phone', 'tablet', 'computer'],
  'vehicles': ['car', 'voiture', 'vélo', 'bike', 'bicycle', 'motorcycle', 'moto'],
  'lighting': ['ampoule', 'bulb', 'led', 'lamp', 'éclairage'],
  'appliances': ['refrigerator', 'frigo', 'washing machine', 'lave-linge', 'microwave']
};

export const getProductCategory = (product: string): string | null => {
  const normalizedProduct = product.toLowerCase();
  
  for (const [category, keywords] of Object.entries(productCategories)) {
    if (keywords.some(keyword => normalizedProduct.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

export const areProductsComparable = (product1: string, product2: string): boolean => {
  const category1 = getProductCategory(product1);
  const category2 = getProductCategory(product2);
  
  // If we can't determine categories, assume they might be comparable
  if (!category1 || !category2) return true;
  
  return category1 === category2;
};

export const generateIncompatibleExplanation = (product1: string, product2: string): string => {
  const category1 = getProductCategory(product1);
  const category2 = getProductCategory(product2);
  
  return `I cannot compare "${product1}" and "${product2}" because they belong to different categories (${category1} vs ${category2}). For a meaningful comparison, please choose two products from the same category, such as two smartphones, two cars, or two light bulbs.`;
};
