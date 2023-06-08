import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@chakra-ui/react";

export default function Component() {
  const { data: session } = useSession();
  const signedIn = !!session;
  const action: () => void = signedIn ? signOut : signIn;

  return (
    <div
      className={`flex p-2 items-center justify-center m-2 ${
        signedIn ? "self-end" : "self-center"
      }`}
    >
      {session?.user?.email}
      <Button className={"ml-2"} onClick={() => action()}>
        Sign {signedIn ? "out" : "in"}
      </Button>
    </div>
  );

  return;
}
