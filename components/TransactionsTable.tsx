import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";

const CategoryBadge = ({ category }: { category: string }) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;
  return (
    <div className={`category-badge ${borderColor} ${chipBackgroundColor}`}>
      <div className={`size-2 rounded-full ${backgroundColor}`} />
      <p className={`text-12 font-medium ${textColor}`}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({
  transactions = [],
}: {
  transactions: Transaction[];
}) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
              No transactions found
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction: Transaction) => {
          const status = getTransactionStatus(new Date(transaction.date));
          const amount = formatAmount(transaction.amount);
          const isDebit = transaction.type === "debit";
          const isCredit = transaction.type === "credit";
          return (
            <TableRow
              key={transaction.id}
              className={`${isDebit || amount[0] === "-" ? "bg-red-50" : "bg-green-50"} border-b border-gray-200`}
            >
              <TableCell className="max-w-[250px] pl-2 pr-10 py-3!">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(transaction.name)}
                  </h1>
                </div>
              </TableCell>
              <TableCell
                className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === "-" ? "text-[#f04438]" : "text-[#039855]"} py-3!`}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>
              <TableCell className="pl-2 pr-10 py-3!">
                <CategoryBadge category={status} />
              </TableCell>
              <TableCell className="pl-2 pr-10 min-w-32 py-3!">
                {formatDateTime(new Date(transaction.date)).dateTime}
              </TableCell>
              <TableCell className="pl-2 pr-10 capitalize min-w-24 py-3!">
                {transaction.paymentChannel}
              </TableCell>
              <TableCell className="pl-2 pr-10 max-md:hidden py-3!">
                <CategoryBadge category={transaction.category} />
              </TableCell>
            </TableRow>
          );
        })
      )}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
