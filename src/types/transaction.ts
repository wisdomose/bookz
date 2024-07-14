export type Transaction = {
  id: string;
  amount: number;
  reference: string;
  status: "pending" | "failed" | "sucessful";
};
