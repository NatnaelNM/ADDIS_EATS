# Addis Eats — Frontend Capstone

Addis Eats is a classroom Ethiopian-food ordering app built with React and Next.js. It demonstrates responsive pages, searchable and filterable menu data, a browser cart, server-validated checkout, role-based classroom authentication, private order status, charts, metadata, and accessibility basics.

## Run locally

Requirements: Node.js 20.9 or newer and internet access for installing dependencies, loading Google fonts, and showing the menu photographs.

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the environment file with `Copy-Item .env.example .env.local`. Set `SESSION_SECRET` to a long random value in `.env.local`. Open `http://localhost:3000`.

For a production build, run `npm run build`, then `npm run start`. The app is not deployed yet; add the real HTTPS URL to `NEXT_PUBLIC_SITE_URL` after deployment.

## Classroom accounts

| Role | Email | Password |
|---|---|---|
| Customer | `customer@addiseats.test` | `customer123` |
| Staff | `staff@addiseats.test` | `staff123` |
| Admin | `admin@addiseats.test` | `admin123` |

You can sign in with either the full email address or the short username (`customer`, `staff`, or `admin`). These accounts are for classroom demonstration only.

## Main walkthrough

- `/` — featured Ethiopian dishes.
- `/menu` — category filters, debounced search, pagination, and add-to-cart controls.
- `/menu/doro` — a dish detail page with its matching food photograph.
- `/cart` — initially empty in a fresh browser; supports quantity changes, removal, and clearing.
- `/signin`, `/sign-in`, or `/login` — demo sign-in (all aliases open the same form).
- `/checkout` — signed-in checkout with server-side customer and cart validation.
- `/orders/[id]` — order status for an order created by the signed-in customer.
- `/dashboard`, `/orders`, `/kitchen`, and `/admin` — role-protected classroom operations pages.

## Required project documents

- `AUTH.md` — route protections, checks, and security verification.
- `DATA.md` — where data is loaded, filtered, refreshed, and stored.
- `PERF.md` — measurement targets and a worksheet for real deployed results.
- `FUTURE.md` — intentionally deferred work and known limitations.

## Image notes

The menu uses dish-specific external photographs: Doro Wot, Tibs, Kitfo, Shiro, Beyaynetu, Gomen, Firfir, Chechebsa, Misir Wot, Atkilt Wot, lentil Sambusa, and Ethiopian buna. Images are not bundled in this archive and require an internet connection. Source and attribution details are kept alongside the menu data in `lib/dishes.js`. Confirm each provider's current terms before public/commercial use.

## Important limitations

This is a learning project, not a production ordering service. The classroom accounts are fixed fixtures. Cart contents are stored in browser local storage. Only newly placed orders appear in order lists; order records are held in process memory, so they can disappear after a server restart or on a multi-instance deployment. There is no payment processor, delivery fee calculation, durable database, password reset, rate limiting, or production security review. Do not use the demo credentials or fallback secrets in a real service.
