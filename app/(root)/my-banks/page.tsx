import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";

const page = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return null;
  const accounts = await getAccounts({ userId: loggedIn.$id });
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox title="My Banks" subtext="Exchange your money with ease" />
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6 ">
            {accounts && accounts.data.map((account:Account) => (
              <BankCard key={account.id} account={account} userName={loggedIn?.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
