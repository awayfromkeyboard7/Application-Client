import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET_KEY,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.login,
          email: profile.node_id,
          image: profile.avatar_url,
        }
      },
    
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('[api/auth] redirect callback', url, baseUrl);
      return baseUrl
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Persist the OAuth access_token to the token right after signin
      console.log('[api/auth] jwt callback', token, user, account, profile, isNewUser);
      if (profile) {
        token.accessToken = account.access_token;
        token.gitId = profile.login;
        token.avatarUrl = profile.avatar_url;
        token.id = profile.id;
        token.nodeId = profile.node_id;
      }
      return token
    },
    async session({ session, token, user }) {
      console.log('[api/auth] session callback', session, token, user);
      // Send properties to the client, like an access_token from a provider.
      session.gitId = token.gitId
      session.avatarUrl = token.avatarUrl
      session.nodeId = token.nodeId
      session.id = token.id
      session.accessToken = token.accessToken
      return session
    }
  }
})