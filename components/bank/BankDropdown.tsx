"use client";

import { useCallback } from "react";
import { cn, formatAmount } from "@/lib/utils";

export const BankDropdown = ({ accounts, setValue, otherStyles }: BankDropdownProps) => {
  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value && setValue) {
        setValue("senderBank", value);
      }
    },
    [setValue],
  );

  return (
    <select
      onChange={handleSelect}
      defaultValue=""
      className={cn(
        "form-select flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        otherStyles,
      )}
    >
      <option value="" disabled>
        Select a bank account
      </option>
      {accounts.map((account: Account) => (
        <option key={account.id} value={account.appwriteItemId}>
          {account.name} (**** {account.mask}) — {formatAmount(account.currentBalance)}
        </option>
      ))}
    </select>
  );
};

