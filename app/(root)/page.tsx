import HeaderBox from "@/components/HeaderBox";
import RightSideBar from "@/components/RightSideBar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const page = () => {
  const loggedIn = {firstName:"Sachin",lastName:"Yadav",email:"sachin@meow.bnk"};
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type='greeting'
            title="Welcome"
            user={loggedIn?.firstName}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={1250.23}/>
        </header>
        RECENT transactions
      </div>
      <RightSideBar user={loggedIn} transactions={[]} banks={[{},{}]} />
    </section>
  );
};

export default page;
