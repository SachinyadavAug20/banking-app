import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";

const PaymentTransferPage = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return null;
  const accounts = await getAccounts({ userId: loggedIn.$id });

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts?.data} />
      </section>
    </section>
  );
};

export default PaymentTransferPage;
