import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSideBar from "@/components/RightSideBar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.action";
import { getLoggedInUser } from "@/lib/actions/user.action";

const page = async (props: SearchParamProps) => {
  const searchParams = await props.searchParams;
  const { id, page } = searchParams;
  const currentPage=Number(page as string)||1;

  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return null;
  const accounts = await getAccounts({ userId: loggedIn.$id }) ?? { data: [], totalBanks: 0, totalCurrentBalance: 0 };
  const appwriteItemId = (id as string) || accounts?.data?.[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={accounts?.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions accounts={accounts?.data ?? []} transactions={account?.transactions ?? []} appwriteItemId={appwriteItemId} page={currentPage} />
      </div>
      <RightSideBar
        user={loggedIn}
        transactions={account?.transactions ?? []}
        banks={accounts?.data?.slice(0, 2) ?? []}
      />
    </section>
  );
};

export default page;
