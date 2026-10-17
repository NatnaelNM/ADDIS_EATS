import SignInForm from "./SignInForm";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account to manage orders and checkout.",
  alternates: { canonical: "/signin" },
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/";
  return <main className="container page-content auth-page"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to Addis Eats</h1><p>Sign in to access your Addis Eats account and available tools.</p>
    <SignInForm next={next} />
    <p><a href="/menu">← Back to public menu</a></p>
  </main>;
}
