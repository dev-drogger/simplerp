import { INVENTORY_ITEMS, recipeA } from "@/lib";
import { ReserveQuantity } from "@/types";

export const reserveQuantity = <T extends { quantity: number }>(items: T[]) => {
  const recipe = recipeA;
  const recipeXQ = items.reduce<Record<string, number>>((acc, item) => {
    Object.entries(recipe).forEach(([material, amountPerUnit]) => {
      const consumed = amountPerUnit * item.quantity;
      acc[material] = (acc[material] ?? 0) + consumed;
    });
    return acc;
  }, {});

  const test = Object.fromEntries(
    Object.entries(recipeXQ).map(([name, amount]) => {
      return [INVENTORY_ITEMS[name as keyof typeof INVENTORY_ITEMS], amount];
    }),
  );

  const final: ReserveQuantity = [];

  for (const [keys, val] of Object.entries(test)) {
    final.push({ itemId: parseInt(keys), amount: val });
  }

  return final;
};
