import BankCard from "./BankCard";
import { countTransactionCategories } from "@/lib/utils";
import { Category } from "./Category";
import PlaidLink from "./PlaidLink";

const RightSideBar = ({ user, banks, transactions }: RightSidebarProps) => {
  const categries: CategoryCount[] = countTransactionCategories(transactions);
  return (
    <aside className="right-sidebar gap-10!">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-4xl font-bold text-blue-500">
              {user?.name[0] || "?"}
            </span>
          </div>
          <div className="profile-details ml-1.5! mt-3!">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email ml-1.5!">{user?.email}</p>
          </div>
        </div>
      </section>
      <section className="bank ml-1.5! gap-3!">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My Banks</h2>
          <PlaidLink user={user} />
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user?.name}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user?.name}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        <div className="pt-15! flex flex-1 flex-col gap-6">
          <h2 className="header-2">Top categries</h2>
          <div className="space-y-5">
            {categries.length > 0 ? (
              categries.map((c) => (
                <Category key={c.name} category={c} />
              ))
            ) : (
              <p className="text-14 text-gray-500">No categories yet</p>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSideBar;
