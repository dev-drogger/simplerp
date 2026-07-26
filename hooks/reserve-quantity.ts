import { INVENTORY_ITEMS, PRODUCTION_MATERIALS, RECIPE, recipeA } from "@/lib";

export const reserveQuantity = <T extends { quantity: number }>(items: T[]) => {
  const recipe = recipeA;

  const totals = items.reduce<Record<string, number>>((acc, item) => {
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      acc[material] = (acc[material] ?? 0) + amountPerUnit * item.quantity;
    });
    return acc;
  }, {});

  return Object.entries(totals).map(([material, amount]) => ({
    itemId: Number(INVENTORY_ITEMS[material as keyof typeof INVENTORY_ITEMS]),
    amount,
  }));
};

export const calculateProductionMaterials = <
  T extends { sku: keyof typeof PRODUCTION_MATERIALS; quantity: number },
>(
  items: T[],
  release?: boolean,
) => {
  const totals = items.reduce<Record<string, number>>((acc, item) => {
    const recipe = PRODUCTION_MATERIALS[item.sku];
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      acc[material] = (acc[material] ?? 0) + amountPerUnit * item.quantity;
    });
    return acc;
  }, {});

  return Object.entries(totals).map(([material, amount]) => ({
    itemId: Number(INVENTORY_ITEMS[material as keyof typeof INVENTORY_ITEMS]),
    amount: release ? -amount : amount,
  }));
};

export const newReserveQuantity = <
  T extends { sku: keyof typeof RECIPE; quantity: number },
>(
  items: T[],
) => {
  const totals = items.reduce<Record<string, number>>((acc, item) => {
    const recipe = RECIPE[item.sku];
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      acc[material] = (acc[material] ?? 0) + amountPerUnit * item.quantity;
    });
    return acc;
  }, {});

  return Object.entries(totals).map(([material, amount]) => ({
    itemId: Number(INVENTORY_ITEMS[material as keyof typeof INVENTORY_ITEMS]),
    amount,
  }));
};

export const calculateStock = <
  T extends { sku: keyof typeof RECIPE; quantity: number },
>(
  items: T[],
  release: boolean,
  production: boolean,
) => {
  const totals = items.reduce<Record<string, number>>((acc, item) => {
    const recipe = production
      ? PRODUCTION_MATERIALS[item.sku]
      : RECIPE[item.sku];
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      acc[material] = (acc[material] ?? 0) + amountPerUnit * item.quantity;
    });
    return acc;
  }, {});

  return Object.entries(totals).map(([material, amount]) => ({
    itemId: Number(INVENTORY_ITEMS[material as keyof typeof INVENTORY_ITEMS]),
    amount: release ? -amount : amount,
  }));
};
