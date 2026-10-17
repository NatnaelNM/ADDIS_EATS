# Performance and Accessibility

## Targets from the capstone rubric

| Metric or check | Target | Actual deployed value | Status / notes |
|---|---|---|---|
| Largest Contentful Paint (LCP) | Under 2.5 s | Not measured | Run Lighthouse on the deployed URL |
| Cumulative Layout Shift (CLS) | 0.10 or lower | Not measured | Check image sizing and font loading |
| Interaction to Next Paint (INP) | 200 ms or lower | Not measured | Test menu search and cart controls on a real phone |
| Menu photographs | Aim for about 150 kB or less each | External image sizes not measured | Replace oversized source images with optimized local assets if licensed |
| Keyboard navigation | Every function reachable | Manual check required | Test Tab, Shift+Tab, Enter, and Space without a mouse |
| Mobile layout | No hover-only action or horizontal overflow | Manual check required | Test on a real phone and a narrow browser viewport |
| Metadata and discovery | One clear H1 per page; valid metadata; no private pages indexed | Code review only | Inspect deployed page source, Open Graph image, sitemap, and robots |

## How to measure

1. Deploy the current commit and open the public HTTPS URL in a private window.
2. Run Chrome Lighthouse in mobile mode and record LCP, CLS, INP, performance score, and the date.
3. Use the browser Network panel to inspect the menu photographs and bundle requests.
4. Navigate the full application using only the keyboard. Confirm focus is visible and every button has a useful accessible name.
5. Open the URL on a real phone. Test the menu, add-to-cart, quantity controls, checkout, and order confirmation.
6. Update the **Actual deployed value** column with observed results. Do not copy targets into the actual column.

## Changes in this revision

- Added dish-specific menu images and descriptive alternative text.
- Added accessible cart quantity and removal controls with 44 px minimum touch targets.
- Added loading and empty-cart states.
- Kept search debounced and pagination server-backed.
- Added a reduced-motion preference for interface transitions.

No Lighthouse values are claimed because a deployed URL was not supplied and this project has not been measured in a production browser in this session.
