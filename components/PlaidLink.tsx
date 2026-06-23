import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { StyledString } from "next/dist/build/swc/types";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.action";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router=useRouter();
  const [token,setToken]=useState('');
  useEffect(()=>{
    const getToken=async()=>{
      const data=await createLinkToken(user);
      setToken(data.linkToken);
    }
    getToken();
  },[user]) // to get token

  const onSuccess=useCallback<PlaidLinkOnSuccess>(async(public_token:string)=>{
    await exchangePublicToken({publicToken:public_token,user});
    router.push('/');
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
        onClick={()=>open}
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
