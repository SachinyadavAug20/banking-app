"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./bankInfo";
import TransactionsTable from "./TransactionsTable";
import { formUrlQuery } from "@/lib/utils";
import { Pagination } from "./Paginations";

interface Props {
  accounts: Account[];
  page?: number;
  transactions?: Transaction[];
  appwriteItemId: string;
}

const RecentTransactions = ({
  accounts,
  page = 1,
  transactions = [],
}: Props) => {
  const rowPage = 10;
  const totalPages = Math.ceil(transactions.length / rowPage);
  const indexOfLastTransaction = page * rowPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeId, setActiveId] = useState(
    searchParams.get("id") || accounts[0]?.appwriteItemId,
  );

  const handleTabChange = (value: string) => {
    setActiveId(value);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <section className="recent-transactions px-2!">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent Transactions</h2>
        <Link
          href={`/transaction-history/?id=${activeId}`}
          className="view-all-btn px-2! py-1!"
        >
          View all
        </Link>
      </header>
      <Tabs
        value={activeId}
        onValueChange={handleTabChange}
        className="w-full flex-col gap-2"
      >
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer"
            >
              <BankTabItem
                key={account.id}
                account={account}
                appwriteItemId={activeId}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo account={account} appwriteItemId={activeId} type="full" />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4">
              <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
