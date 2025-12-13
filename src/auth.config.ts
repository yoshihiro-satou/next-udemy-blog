import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/manage');
      const isOnLogin = nextUrl.pathname === '/login';

      // 保護されたページ（dashboard/manage）で未ログインならfalse → 自動で/loginにリダイレクト
      if (isOnDashboard) {
        return isLoggedIn;
      }

      // ログイン済みで/loginページにアクセスしたら/dashboardにリダイレクトしたい場合
      // （これもmiddlewareでやるのは非推奨。クライアント側やページ内で処理する方が安全）
      // ここでは単純にtrueを返してアクセス許可（後述の代替案参照）
      return true;

      // もしログイン後/loginをブロックしたいなら：
      
      if (isOnLogin && isLoggedIn) {
        return false;  // falseにすると自動でホーム（/）にリダイレクトされる（デフォルト動作）
      }
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
