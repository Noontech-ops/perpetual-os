import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Supabase session refresh for API routes to avoid slow auth timeouts
  if (pathname.startsWith('/api/')) {
    return NextResponse.next({ request });
  }

  const response = await updateSession(request);

  if (pathname.startsWith('/os') || pathname.startsWith('/onboarding') || pathname.startsWith('/dashboard')) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || key === 'proxy-injected') return response;

    try {
      const { createServerClient } = await import('@supabase/ssr');
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user && !error) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Auth check failed — let the page load rather than redirect-loop
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
