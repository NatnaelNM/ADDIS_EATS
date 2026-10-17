# Deferred Work and Known Limitations

These items are intentionally outside the classroom scope or require infrastructure that is not included in this repository.

## Must address before production

- Replace process-memory orders and idempotency keys with a durable database and transactional writes.
- Replace demo users with a maintained authentication provider and real account management.
- Set a unique `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` in each deployment environment.
- Verify order ownership on every route and API, and add rate limiting, monitoring, audit logs, and a security review.
- Review image licensing and optimize permitted photographs into local responsive assets.
- Add delivery fees, service areas, order notifications, and a real payment workflow only after their server-side rules are defined.

## Nice to have

- Add a database-backed menu editor and order-status management for staff.
- Add cart recovery across devices only if an authenticated server-side cart is required.
- Add automated unit, API, accessibility, and end-to-end tests.
- Add image loading fallbacks and a managed image/CDN pipeline.
- Measure the deployed application with Lighthouse and record real before/after values in `PERF.md`.

## Current deliberate cuts

- No real payment provider or delivery-fee calculation.
- No persistent database; demo orders can disappear after a restart.
- No password reset, customer registration, or email/SMS notifications.
- No claim that the application is deployed or has passed a production Lighthouse audit.
