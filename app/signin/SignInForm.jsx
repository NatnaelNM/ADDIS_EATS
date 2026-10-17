"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function SignInForm({ next }) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form className="checkout-card" action={action} aria-busy={pending}>
      <input type="hidden" name="next" value={next} />

      <div className="form-row">
        <label htmlFor="signin-email">Email or username</label>
        <input
          id="signin-email"
          name="email"
          type="text"
          autoComplete="username"
          placeholder="admin or admin@addiseats.test"
          autoCapitalize="none"
          spellCheck={false}
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
