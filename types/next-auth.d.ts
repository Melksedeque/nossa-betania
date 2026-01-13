import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: string;
      /** The user's balance in Armandólars. */
      balance: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    balance: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    balance: number;
  }
}
