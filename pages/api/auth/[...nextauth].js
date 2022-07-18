import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET_KEY,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('redirect callback >>>>> ', url, baseUrl);
      return baseUrl
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      console.log('[api/auth] jwt callback', token, account);
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      console.log('[api/auth] session callback', session, token, user);
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  }
})