# Fix: Self-Signed Certificate Error in Vercel

Node.js on Vercel's server-side doesn't trust self-signed SSL certificates. This causes errors like:
```
Error: self-signed certificate
code: 'DEPTH_ZERO_SELF_SIGNED_CERT'
```

## Solution

I've created a `serverFetch` utility that accepts self-signed certificates. You need to:

1. **Import the utility** in server-side files
2. **Replace `fetch` with `serverFetch`** for HTTPS API calls

## Files Already Updated

✅ `actions/auth-action.ts` - Login and register
✅ `data/company/get-companies.ts` - Company, countries, currencies

## Files That Need Updating

Update these files to use `serverFetch` instead of `fetch`:

### Pattern to Follow:

**Before:**
```typescript
import { getToken } from "@/actions/auth-action";

const res = await fetch(`${url}/api/...`, {
  method: "GET",
  headers: { ... },
});
```

**After:**
```typescript
import { getToken } from "@/actions/auth-action";
import { serverFetch } from "@/lib/server-fetch";

const res = await serverFetch(`${url}/api/...`, {
  method: "GET",
  headers: { ... },
});
```

### Files to Update:

1. `data/orders/get-orders.ts` - All order fetching functions
2. `data/orders/create-orders.ts` - Order creation
3. `data/orders/update-orders.ts` - Order updates
4. `data/orders/delete-orders.ts` - Order deletion
5. `data/product/get-products.ts` - Product fetching
6. `data/product/create-products.ts` - Product creation
7. `data/product/update-product.ts` - Product updates
8. `data/product/delete-product.ts` - Product deletion
9. `data/users/get-users.ts` - Users fetching
10. `data/branches/get-branches.ts` - Branches fetching
11. `data/inventory/get-inventory.ts` - Inventory fetching
12. `data/bills/get-bills.tsx` - Bills and invoices
13. `data/accounts/get-accounts.tsx` - Accounts
14. `data/category/get-category.ts` - Categories
15. `data/payments/get-pay.tsx` - Payment fetching
16. `data/payments/create-pay.tsx` - Payment creation
17. `actions/create-actions.ts` - Create actions
18. `actions/update-actions.ts` - Update actions
19. `actions/company-actions.ts` - Company actions
20. `actions/account-actions.ts` - Account actions
21. `actions/create-users.ts` - User creation

## Quick Find & Replace

For each file:

1. **Add import at the top:**
   ```typescript
   import { serverFetch } from "@/lib/server-fetch";
   ```

2. **Replace all `fetch(` with `serverFetch(`:**
   - In VS Code: Find & Replace (Ctrl+H)
   - Find: `await fetch(`
   - Replace: `await serverFetch(`
   - Make sure to only replace in server-side files (those with "use server" or "server-only")

## Important Notes

- **Only update server-side files** (marked with `"use server"` or `import "server-only"`)
- **Don't update client-side files** - browsers handle self-signed certs differently (users accept the warning)
- **This is a temporary solution** - For production, get a proper SSL certificate (Let's Encrypt)

## Testing

After updating files:
1. Commit and push changes
2. Vercel will automatically redeploy
3. Test login/API calls - the self-signed certificate error should be gone

## Long-term Solution

Get a proper SSL certificate:
1. Get a free domain (Freenom, DuckDNS, No-IP)
2. Use Let's Encrypt to get a trusted certificate
3. Then you can use regular `fetch` again
