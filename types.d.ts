type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];

type PaymentStatus = "pending" | "processing" | "success" | "failed";

type Inventory = {
  id: string;
  name: string;
  quantity: number;
  status: "in-stock" | "out-of-stock" | "discontinued";
  category: "men" | "women" | "unisex" | "packaging" | "raw";
};

type Sale = {
  date: string;
  invoice: string;
  customer: string;
  item: Product[];
  status: SaleStatus;
  amount: number;
};

type SaleStatus =
  | "completed"
  | "shipped"
  | "cancelled"
  | "returned"
  | "pending";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: "women" | "men" | "unisex";
};
