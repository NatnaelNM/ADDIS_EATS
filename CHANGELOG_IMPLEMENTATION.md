# Requested changes

- Added an admin-only-page CSV report download, exporting the currently stored orders and their order/customer/delivery/status/total/item fields.
- Added a skip-to-content link, clear visible focus styling (using the existing focus rules), and global keyboard shortcuts: `Alt+Shift+H` home, `Alt+Shift+M` menu, `Alt+Shift+C` cart, `Alt+Shift+O` orders, and `Alt+Shift+A` admin. Standard Tab/Shift+Tab, Enter, Space, and arrow-key behavior of native controls remains available.
- Added a live countdown estimate on the delivery tracking page and a moving illustrative courier marker on the map. The UI explicitly states these are estimates/simulation, not real courier GPS tracking.
- Removed `lib/demo-orders.js`, an unused demo fixture module with no imports/references.

## Validation

All JavaScript/JSX source files passed a TypeScript parser/transpilation syntax check. A full Next.js build could not be run because dependency installation (`npm ci`) timed out in this environment.
