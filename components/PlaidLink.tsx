"use client";

import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.action";
import { toast } from "sonner";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const getToken = async () => {
      const data = await createLinkToken(user);
      if (data?.linkToken) {
        setToken(data.linkToken);
      } else {
        toast.error("Bank linking unavailable", {
          description:
            "Could not initialize the linking service. Please refresh and try again.",
        });
      }
    };
    getToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      try {
        await exchangePublicToken({ publicToken: public_token, user });
        toast.success("Bank account linked!", {
          description:
            "Your bank has been connected. You can now make transfers.",
        });
        router.push("/");
      } catch (error) {
        toast.error("Bank linking failed", {
          description:
            "Could not connect your bank. Please try again or choose a different bank.",
        });
      }
    },
    [user],
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const plaidLinkUseage = usePlaidLink(config);
  const { open, ready } = plaidLinkUseage;

  return (
    <>
      {variant === "primary" ? (
        <Button
          className="plaidlink-primary"
          disabled={!ready}
          onClick={() => open()}
        >
          Connect with Plaid
        </Button>
      ) : variant === "ghost" ? (
        <Button onClick={() => open()} className="plaidlink-ghost">
          <Image
            src="/icons/connect-bank.svg"
            alt="connect"
            width={25}
            height={25}
            loading="eager"
          />
          <p className="hidden xl:block text-[16px] font-semibold text-black-2">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <p className="text-[16px] font-semibold text-black-2">Add bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
