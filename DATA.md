# Data and Refresh Strategy

| Data | Where it runs | Source and key | Refresh or persistence rule | Reason |
|---|---|---|---|---|
| Menu catalogue | Server | `lib/dishes.js`, dish `id` | Static module data; page revalidates hourly | Small public catalogue that does not need per-user data access |
| Initial menu results | Server | `app/menu/page.js`, category | First four matching dishes are rendered on the server | Fast first content and crawlable menu text |
| Menu search and paging | Browser + API | SWR key `/api/dishes?q=…&category=…&page=…` | Search is debounced by 300 ms; SWR deduplicates requests | Keeps input responsive and avoids requests on every keystroke |
| Cart | Browser | `localStorage`, key `addis-eats-cart-v1` | Updated when cart items change; empty on a fresh browser | The cart is a user interaction state, not a trusted price source |
| Checkout customer details | Server action | `validateOrder` in `lib/schema.js` | Validate on every submission | Client validation alone can be bypassed |
| Checkout items and prices | Server action | `getDishOrderLines` in `lib/dishes.js` | Every submitted ID and quantity is checked; price comes from server menu data | Prevents forged prices and unknown dishes |
| Order and idempotency record | Server process memory | `lib/order-store.js` | Available while the process remains alive | Demonstrates ownership checks and repeat-submit protection without a database |
| Admin dashboard and order tables | Server | `lib/order-store.js` | Orders created through checkout during the current process | Empty state until real checkout orders exist |
| Live delivery status | Browser + API | Server-Sent Events endpoint under `/api/orders/[id]/stream` | Event stream sends updates; client closes it on unmount | Demonstrates a push-style update channel |
| ETB and Addis Ababa dates | Shared utility | `lib/format.js` | Formatted at render time with `Intl` | Consistent local currency and time display |
| CSV export | Server-generated text | `lib/csv.js` | Generated for the selected record | Makes data export explicit and easy to verify |

## Cache and privacy notes

Menu data is public. Session and order pages are dynamic and must not be shared across users. A cart is local to the current browser profile and is not a server-side order until checkout is submitted. Never treat local storage as an authority for prices, customer identity, or order ownership.

## Production replacement

Move menu, user, order, and idempotency records to a durable database. Use ownership-scoped queries, transactional writes, database uniqueness for idempotency keys, and cache invalidation after menu changes. Do not deploy the process-memory order store to multiple instances and expect consistent results.
