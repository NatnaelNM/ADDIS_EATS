# Authentication and Security

## Current protections

| Route or action | Required check | Expected result when refused |
|---|---|---|
| `/checkout` | Server reads the signed session cookie | Redirect to `/signin?next=/checkout` |
| `/orders/[id]` | Signed-in session and order ownership, unless staff/admin | Redirect when signed out; not-found response for another user's order |
| `/dashboard` | Signed-in staff/admin role | Redirect or access-denied page |
| `/kitchen` | Signed-in staff/admin role | Redirect or access-denied page |
| `/admin` | Admin role | Access denied for other roles |
| `POST /api/orders` | Session, customer validation, request key, and server-side cart-price lookup | 401 or validation error |
| `GET /api/orders/[id]` | Session and order ownership, unless staff/admin | 401, 403, or 404 |
| `placeOrder` server action | Session, customer validation, non-empty cart, known dish IDs, quantity bounds, and server-side prices | Returns an error state without creating an order |
| `signIn` server action | Classroom email-or-username credentials and same-site `next` destination | Reject invalid credentials or fall back to `/`; admins always go to `/admin` |

## Authorization checks to demonstrate

1. **Signed out:** request `POST /api/orders` without the session cookie. It must return `401`.
2. **Different owner:** sign in as a customer and request another customer's private order ID. The page/API must not reveal the order.
3. **External return URL:** sign in through `/signin?next=https://example.com`. A successful sign-in must not navigate to that external host.

Also test an unknown order ID, a forged dish ID, a quantity of zero or above 50, and an empty cart submission. The server must reject invalid data and recalculate prices from `lib/dishes.js`; it must not trust client-supplied prices or owner IDs.

## Limitations and production follow-up

- User accounts are static classroom fixtures. Password hashes are demo values; replace this module with a maintained authentication library and real user store.
- Sessions use an HMAC-signed, expiring, HTTP-only cookie. Configure a unique `SESSION_SECRET` in every deployed environment.
- The order store and idempotency map are process-local. The admin can delete one order or clear all stored orders; both operations require an admin session. Replace them with a database transaction and a unique idempotency constraint before deployment.
- Add rate limiting, CSRF/origin policy appropriate to the deployment, audit logs, session revocation, password reset, and a security review before production use.
