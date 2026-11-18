---
title: Avoid Barrel Imports
impact: MEDIUM
impactDescription: Improves tree-shaking and reduces bundle size
tags: imports, performance, bundling
---

## Avoid Barrel Imports

**Impact: MEDIUM (Improves tree-shaking and reduces bundle size)**

Barrel files (index.ts that re-export from multiple modules) can hurt tree-shaking and increase bundle sizes. Import directly from source files instead.

**Incorrect (importing from barrel files):**

```typescript
// Importing from index.ts barrel files
import { BookingService, UserService } from "./services";

// Importing from @rondevu/ui barrel
import { Button } from "@rondevu/ui";
```

**Correct (importing directly from source):**

```typescript
// Import directly from source files
import { BookingService } from "./services/BookingService";
import { UserService } from "./services/UserService";

// Import directly from component path
import { Button } from "@rondevu/ui/components/button";
```

Reference: [rOndevu Engineering Standards](README.md)
