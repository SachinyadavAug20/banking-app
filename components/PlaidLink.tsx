import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.action";
import { toast } from "sonner";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router=useRouter();
  const [token,setToken]=useState('');
  useEffect(()=>{
    const getToken=async()=>{
      const data=await createLinkToken(user);
      if (data?.linkToken) {
        setToken(data.linkToken);
      } else {
        toast.error("Bank linking unavailable", { description: "Could not initialize the linking service. Please refresh and try again." });
      }
    }
    getToken();
  },[user])

  const onSuccess=useCallback<PlaidLinkOnSuccess>(async(public_token:string)=>{
    try {
      await exchangePublicToken({publicToken:public_token,user});
      toast.success("Bank account linked!", { description: "Your bank has been connected. You can now make transfers." });
      router.push('/');
    } catch (error) {
      toast.error("Bank linking failed", { description: "Could not connect your bank. Please try again or choose a different bank." });
    }
  },[user])

  const config:PlaidLinkOptions={
    token,
    onSuccess
  }

  const {open,ready}=usePlaidLink(config);
  return (
    <>
      {variant === "primary" ? (
        <Button className="plaidlink-primary"
        disabled={!ready}
        onClick={()=>open()}
        >Connect with Plaid</Button>
      ) : variant === "ghost" ? (
        <Button className="plaidlink-ghost">Connect with Plaid</Button>
      ) : (
        <Button className="plaidlink-default">Connect with Plaid</Button>
      )}
    </>
  );
};

export default PlaidLink;
