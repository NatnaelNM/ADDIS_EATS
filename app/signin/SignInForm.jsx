"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function SignInForm({ next }) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form className="checkout-card" action={action} aria-busy={pending}>
      <input type="hidden" name="next" value={next} />

      <div className="form-row">
        <label htmlFor="signin-email">Email address</label>
        <input
          id="signin-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="customer@addiseats.test"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="button primary full" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
