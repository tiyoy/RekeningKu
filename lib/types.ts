export type AccountCategory = "rekening" | "ewallet" | "qris";

export type Account = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  category: AccountCategory;
  qrisImageUrl: string | null;
  qrisPublicId: string | null;
  label: string;
  icon: string;
  cardTheme: string;
  notes: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminSession = {
  username: string;
  role: "admin";
};
