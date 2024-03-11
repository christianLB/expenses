import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@mantine/core";

export default function Component() {
  const { data: session } = useSession();
  const signedIn = !!session;

  const handleSignIn = () => {
    if (signedIn) {
      signOut();
    } else {
      signIn("google", {
        callbackUrl: "/expenses", // Redirige a '/expenses' después del inicio de sesión
      });
    }
  };

  return (
    <div
      className={`flex p-2 items-center justify-center m-2 ${
        signedIn ? "self-end" : "self-center"
      }`}
    >
      {session?.user?.email}
      <Button className={"ml-2"} onClick={handleSignIn}>
        {signedIn ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
