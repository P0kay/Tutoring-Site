import { Geist, Geist_Mono, Lilita_One } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from '@/app/lib/auth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TutoringSite",
  description: "Find qualified tutors by subject, connect with online educators, and choose the right support to learn with confidence.",
};
const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita-one",
});

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-slate-900"
            >
              TutoringSite
            </Link>

            <nav className="flex items-center gap-3">
              {/* Nav link */}
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-all hover:bg-slate-200 hover:border-slate-300 hover:shadow-sm"
              >
                Main page
              </Link>

              {user ? (
                <>
                  {user.type === "admin" && (
                    <Link
                      href="/admin-panel"
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-all hover:bg-slate-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      Admin panel
                    </Link>
                  )}

                  {(user.type === "admin" || user.type === "tutor") && (
                    <Link
                      href="/tutor-panel"
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white
                                 px-4 py-2 text-sm font-medium text-slate-800 transition-all
                                 hover:bg-slate-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      Tutor panel
                    </Link>
                  )}

                  <Link
                    href="/my-profile"
                    className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900
                               px-4 py-2 text-sm font-medium text-white transition-all
                               hover:bg-slate-700 hover:-translate-y-px hover:shadow-sm"
                  >
                    My profile
                  </Link>

                  <form action="/api/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-200 hover:border-red-400 hover:shadow-sm cursor-pointer"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white
                               px-4 py-2 text-sm font-medium text-slate-800 transition-all
                               hover:bg-slate-200 hover:border-slate-300 hover:shadow-sm"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md border border-slate-900 bg-slate-900
                               px-4 py-2 text-sm font-medium text-white transition-all
                               hover:bg-slate-700 hover:-translate-y-px hover:shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
