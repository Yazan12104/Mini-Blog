import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Admin Login",
			credentials: {
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (credentials?.password === process.env.ADMIN_PASSWORD) {
					// Return a simple user object for the session
					return { id: "1", name: "Admin", email: "admin@miniblog.com" };
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
