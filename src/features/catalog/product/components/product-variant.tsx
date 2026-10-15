"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProductWeight } from "../../catalog-model";

type ProductVariant = {
  weight: ProductWeight;
  setWeight: (weight: ProductWeight) => void;
};
const VariantContext = createContext<ProductVariant | null>(null);

// Local to one product page: the summary and specifications share the weight.
export function ProductVariantProvider({ children }: { children: ReactNode }) {
  const [weight, setWeight] = useState<ProductWeight>(1);
  return (
    <VariantContext.Provider value={{ weight, setWeight }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useProductVariant() {
  const value = useContext(VariantContext);
  if (!value)
    throw new Error("Product variant requires ProductVariantProvider");
  return value;
}

export function ProductWeightText() {
  const { weight } = useProductVariant();
  return <>{weight} кг</>;
}
