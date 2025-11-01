# LoginRequiredModal - General Purpose Authentication Component

## Overview

`LoginRequiredModal` is a **reusable, general-purpose authentication modal** that can be used across your entire Kuzzy application to protect any page, form, or component from unauthorized access.

**Key Benefits:**
- ✅ **General Purpose** - Use anywhere in the app
- ✅ **Full View Blocking** - Prevents interaction with protected content
- ✅ **Beautiful UI** - Gradient header, icons, responsive design
- ✅ **Two Integration Methods** - Direct component or HOC pattern
- ✅ **Customizable** - Title, message, and behavior
- ✅ **Redux Connected** - Automatically checks auth state
- ✅ **Production Ready** - Used in AddStoreForm

---

## Quick Start

### Method 1: Direct Component (5 seconds)
```tsx
import { LoginRequiredModal } from '@/components/modals/LoginRequiredModal';

export default function MyPage() {
  return (
    <>
      <LoginRequiredModal title="My Feature" message="Login to access this." />
      {/* Your protected content */}
    </>
  );
}
```

### Method 2: HOC Wrapper (5 seconds)
```tsx
import { withLoginRequired } from '@/components/modals/withLoginRequired';

function MyPage() {
  return <div>Protected content</div>;
}

export default withLoginRequired(MyPage, {
  modalTitle: 'Access Required',
  modalMessage: 'Please log in to continue.',
});
```

### Method 3: Custom Hook (5 seconds)
```tsx
import { useLoginRequired } from '@/hooks/useLoginRequired';

export default function MyPage() {
  const { isLoggedIn } = useLoginRequired();
  
  return isLoggedIn ? <MyContent /> : <LoginRequiredModal />;
}
```

---

## Installation

**No installation needed!** Components already exist:
- `components/modals/LoginRequiredModal.tsx` - Modal component
- `components/modals/withLoginRequired.tsx` - HOC wrapper
- `hooks/useLoginRequired.ts` - Custom hook

---

## How It Works

### Authentication Flow
```
User visits page
    ↓
Check Redux auth state (state.auth.userId)
    ↓
If NO userId → Show LoginRequiredModal
If YES userId → Show page content
    ↓
User clicks Login/Register button
    ↓
Modal closes, route to /login or /register
    ↓
User logs in/registers
    ↓
Modal disappears automatically, content shows
```

### z-index Layers
```
Content           (z-0)
Modal backdrop    (z-40) - semi-transparent black
Modal itself      (z-50) - floats above everything
```

---

## Complete Usage Guide

## 1️⃣ Direct Component Method

Perfect for **component-level protection** or **conditional rendering**.

### Basic - Auto Auth Check
```tsx
import { LoginRequiredModal } from '@/components/modals/LoginRequiredModal';

export default function UploadPhotos() {
  return (
    <div>
      <LoginRequiredModal />
      <h1>Upload Your Photos</h1>
      {/* Form content */}
    </div>
  );
}
```
**Behavior:** Automatically checks `state.auth.userId` and shows modal if not logged in.

---

### Custom Title & Message
```tsx
<LoginRequiredModal
  title="Photo Upload Required"
  message="You need to be logged in to upload photos. Sign in or create an account to get started."
/>
```

**Common Messages:**
```tsx
// Vendor registration
<LoginRequiredModal
  title="Vendor Registration"
  message="Create a vendor account to start selling on Kuzzy."
/>

// Customer dashboard
<LoginRequiredModal
  title="My Dashboard"
  message="Sign in to view your orders and account information."
/>

// Delivery feature
<LoginRequiredModal
  title="Delivery Tracking"
  message="Log in to track your orders and deliveries."
/>

// Admin section
<LoginRequiredModal
  title="Admin Access"
  message="You must be an administrator to access this section."
/>
```

---

### Explicit Control with Props
```tsx
const [showModal, setShowModal] = useState(false);

<LoginRequiredModal
  isOpen={showModal}
  title="Feature Locked"
  message="Premium features require login."
  onClose={() => setShowModal(false)}
/>
```

---

### Conditional Rendering
```tsx
import { useAppSelector } from '@/redux/hooks';

export default function CameraView() {
  const { userId } = useAppSelector(state => state.auth);

  return (
    <div>
      {!userId && (
        <LoginRequiredModal
          title="Camera Access"
          message="Sign in to use the camera feature."
        />
      )}
      {userId && <CameraComponent />}
    </div>
  );
}
```

---

## 2️⃣ HOC (Higher-Order Component) Method

Perfect for **protecting entire pages** or **form components**.

### Basic HOC
```tsx
import { withLoginRequired } from '@/components/modals/withLoginRequired';

function VendorRegistration() {
  return (
    <form>
      <h1>Register Your Vendor Account</h1>
      {/* Form fields */}
    </form>
  );
}

// Export wrapped component
export default withLoginRequired(VendorRegistration);
```

**Behavior:** 
- If not logged in → Shows modal, hides form
- If logged in → Hides modal, shows form

---

### HOC with Custom Options
```tsx
const ProtectedDashboard = withLoginRequired(Dashboard, {
  modalTitle: 'Vendor Dashboard',
  modalMessage: 'Access your vendor dashboard to manage your store.',
  showContentBehind: false, // Don't show form behind modal
});

export default ProtectedDashboard;
```

---

### HOC with Content Behind Modal
```tsx
// Shows dashboard faded behind modal while modal is open
export default withLoginRequired(Dashboard, {
  modalTitle: 'Premium Feature',
  modalMessage: 'Upgrade to access advanced analytics.',
  showContentBehind: true, // Form visible but faded
});
```

---

## 3️⃣ Custom Hook Method

Perfect for **complex auth logic** or **redirect patterns**.

### Basic Hook
```tsx
import { useLoginRequired } from '@/hooks/useLoginRequired';

export default function Analytics() {
  const { isLoggedIn, userId } = useLoginRequired();

  if (!isLoggedIn) {
    return <LoginRequiredModal title="Analytics" />;
  }

  return <AnalyticsComponent userId={userId} />;
}
```

---

### Hook with Auto-Redirect
```tsx
export default function AdminPanel() {
  // Auto-redirects to /dashboard if not logged in
  const { isLoggedIn } = useLoginRequired('/dashboard');

  if (!isLoggedIn) {
    return null; // Component returns null, redirect happens
  }

  return <AdminContent />;
}
```

---

## Real-World Examples

### Example 1: AddStoreForm (Current Implementation)
```tsx
import { LoginRequiredModal } from '@/components/modals/LoginRequiredModal';
import { useAppSelector } from '@/redux/hooks';

export const AddStoreForm: React.FC = ({ onClose }) => {
  const { userId } = useAppSelector(state => state.auth);
  const { register, handleSubmit } = useForm<StoreFormData>();

  return (
    <>
      {/* Show modal if NOT logged in */}
      {!userId && (
        <LoginRequiredModal
          title="Vendor Registration Required"
          message="You need to be logged in to create a vendor profile. Sign in or register to get started."
        />
      )}

      {/* Show form ONLY if logged in */}
      {userId && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('storeName')} placeholder="Store Name" />
          {/* More form fields */}
          <button type="submit">Create Store</button>
        </form>
      )}
    </>
  );
};
```

---

### Example 2: Customer Orders Page
```tsx
// app/customer/orders/page.tsx

import { withLoginRequired } from '@/components/modals/withLoginRequired';
import { OrdersList } from '@/components/orders/OrdersList';

function OrdersPage() {
  return (
    <div className="p-6">
      <h1>My Orders</h1>
      <OrdersList />
    </div>
  );
}

export default withLoginRequired(OrdersPage, {
  modalTitle: 'My Orders',
  modalMessage: 'Sign in to view your order history and track deliveries.',
});
```

---

### Example 3: Delivery Agent Dashboard
```tsx
// app/agent/dashboard/page.tsx

import { withLoginRequired } from '@/components/modals/withLoginRequired';
import { Dashboard } from '@/components/agent/Dashboard';

export default withLoginRequired(Dashboard, {
  modalTitle: 'Delivery Agent Dashboard',
  modalMessage: 'You must be logged in as a delivery agent to access this dashboard.',
  showContentBehind: true,
});
```

---

### Example 4: Inventory Management
```tsx
import { LoginRequiredModal } from '@/components/modals/LoginRequiredModal';
import { useAppSelector } from '@/redux/hooks';

export default function InventoryPage() {
  const { userId } = useAppSelector(state => state.auth);

  if (!userId) {
    return (
      <LoginRequiredModal
        title="Inventory Management"
        message="Manage your product inventory. Please log in to continue."
      />
    );
  }

  return <InventoryManager />;
}
```

---

### Example 5: Chat/Messaging Feature
```tsx
import { withLoginRequired } from '@/components/modals/withLoginRequired';

function ChatPage() {
  return <ChatWindow />;
}

export default withLoginRequired(ChatPage, {
  modalTitle: 'Messages',
  modalMessage: 'Sign in to send and receive messages.',
});
```

---

## Component Props Reference

### LoginRequiredModal Props
```typescript
interface LoginRequiredModalProps {
  // Whether to show the modal
  // Default: checks Redux auth state (!userId)
  isOpen?: boolean;

  // Title at top of modal
  // Default: 'Login Required'
  title?: string;

  // Main message text
  // Default: 'You need to be logged in to access this feature...'
  message?: string;

  // Callback when modal closes
  onClose?: () => void;
}
```

**Example:**
```tsx
<LoginRequiredModal
  isOpen={true}
  title="Custom Title"
  message="Custom message text"
  onClose={() => console.log('Modal closed')}
/>
```

---

### withLoginRequired Options
```typescript
interface WithLoginRequiredOptions {
  // Title for the modal
  modalTitle?: string;

  // Message for the modal
  modalMessage?: string;

  // Show component content faded behind modal?
  // true: Content visible but dimmed
  // false: Content completely hidden
  showContentBehind?: boolean;
}
```

**Example:**
```tsx
withLoginRequired(MyComponent, {
  modalTitle: 'Feature Locked',
  modalMessage: 'Login to access this.',
  showContentBehind: false,
})
```

---

## Button Behavior

### Login Button
- **Action:** Navigate to `/login` page
- **Icon:** Lock with open shape
- **Color:** Indigo (brand color)
- **Behavior:** Router push to login

### Register Button
- **Action:** Navigate to `/register` page
- **Icon:** User plus icon
- **Color:** Outlined indigo
- **Behavior:** Router push to register

Both buttons automatically close the modal when clicked.

---

## Visual Design

### Modal Layout
```
┌─────────────────────────────────────────┐
│ 🔒 Your Custom Title                    │  ← Header with icon
├─────────────────────────────────────────┤
│                                         │
│ Your custom message text goes here.    │
│ It can be multiple lines if needed.    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💡 Tip: Additional helpful text     │ │  ← Info box
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  [Login]              [Register]       │  ← Buttons
└─────────────────────────────────────────┘
 ↓
[Dark semi-transparent backdrop behind]
```

### Color Palette
| Element | Color | HEX |
|---------|-------|-----|
| Header Background | Indigo-600 to Indigo-700 | #4F46E5 |
| Login Button | Indigo-600 | #4F46E5 |
| Register Button | Outlined Indigo | #4F46E5 |
| Info Box Background | Blue-50 | #EFF6FF |
| Info Box Border | Blue-200 | #BFDBFE |
| Info Box Text | Blue-800 | #1E40AF |
| Backdrop | Black 50% opacity | rgba(0,0,0,0.5) |

### Responsive Design
- **Desktop:** Modal centered, width 28rem (448px)
- **Tablet:** Adapted width, full height with padding
- **Mobile:** Full screen with padding, buttons stack if needed

---

## Styling & Customization

### Tailwind Classes Used
```tsx
// Modal Container
className="fixed inset-0 flex items-center justify-center"

// Header
className="bg-gradient-to-r from-indigo-600 to-indigo-700"

// Info Box
className="bg-blue-50 border border-blue-200"

// Buttons
className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
```

### Customization Examples

**Change Button Colors:**
If you need to modify button colors, edit `LoginRequiredModal.tsx`:
```tsx
// Old
className="bg-indigo-600"

// New (e.g., for green theme)
className="bg-green-600"
```

**Change Header Gradient:**
```tsx
// Old
className="bg-gradient-to-r from-indigo-600 to-indigo-700"

// New (e.g., for blue theme)
className="bg-gradient-to-r from-blue-600 to-blue-700"
```

---

## Authentication State Reference

The modal checks Redux auth state:

```typescript
// In components/modals/LoginRequiredModal.tsx
const { userId } = useAppSelector(state => state.auth);
const shouldShow = isOpen !== undefined ? isOpen : !userId;

// In redux/authSlice.ts
interface AuthState {
  userId: string | null;
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}
```

**Auth States:**
- `userId === null` → User not logged in → Modal shows
- `userId === undefined` → User checking auth → Modal hidden (safe default)
- `userId === string (e.g., "12345")` → User logged in → Modal hides
- `userId === ""` → Invalid token → Modal shows

---

## Integration Checklist

### ✅ Setup (Already Done)
- [x] LoginRequiredModal component exists
- [x] withLoginRequired HOC exists
- [x] useLoginRequired hook exists
- [x] Redux auth state configured
- [x] Navigation routing available

### ✅ Usage (Easy!)
To protect any page/form:
1. **Choose method:** Direct component, HOC, or hook
2. **Import component:** `import { LoginRequiredModal } from '@/components/modals/LoginRequiredModal'`
3. **Add to component:** Wrap or insert modal
4. **Customize:** Add title and message
5. **Done!** Modal protects your feature

---

## Common Patterns

### Pattern 1: Simple Page Protection
```tsx
export default withLoginRequired(PageComponent, {
  modalTitle: 'Page Title',
  modalMessage: 'Login message...'
});
```
✅ **Use for:** Entire pages, dashboards

---

### Pattern 2: Feature-Level Protection
```tsx
function Feature() {
  const { userId } = useAppSelector(state => state.auth);
  
  if (!userId) {
    return <LoginRequiredModal title="Feature" />;
  }
  
  return <FeatureComponent />;
}
```
✅ **Use for:** Specific features, conditional sections

---

### Pattern 3: Form Protection
```tsx
{!userId && <LoginRequiredModal />}
{userId && <FormComponent />}
```
✅ **Use for:** Multi-step forms, complex UX

---

### Pattern 4: HOC with Content Behind
```tsx
withLoginRequired(Component, {
  showContentBehind: true
})
```
✅ **Use for:** Premium features, upgrade prompts

---

## Pages to Protect

### High Priority 🔴
- [ ] Vendor Registration (`app/features/vendors/register`)
- [ ] Agent Dashboard (`app/features/agents/dashboard`)
- [ ] Order Management (`app/features/orders/manage`)
- [ ] Inventory (`app/features/inventory`)

### Medium Priority 🟡
- [ ] Customer Profile (`app/customer/profile`)
- [ ] Order History (`app/customer/orders`)
- [ ] Delivery Tracking (`app/customer/deliveries`)
- [ ] Messaging (`app/customer/messages`)

### Low Priority 🟢
- [ ] Analytics (`app/features/analytics`)
- [ ] Settings (`app/features/settings`)
- [ ] Preferences (`app/features/preferences`)

---

## Troubleshooting

### Issue: Modal not showing
**Causes:**
- Redux auth state not set up
- `userId` not in Redux
- z-index CSS conflict

**Solutions:**
```tsx
// Check auth state
const { userId } = useAppSelector(state => state.auth);
console.log('Current userId:', userId);

// Verify Redux is connected
const auth = useAppSelector(state => state.auth);
console.log('Auth state:', auth);
```

---

### Issue: Modal always showing
**Causes:**
- `userId` is always null
- Auth slice not configured
- Login endpoint not working

**Solutions:**
```tsx
// After login, verify userId is set
// In Redux DevTools, check state.auth.userId
```

---

### Issue: Buttons not navigating
**Causes:**
- `next/navigation` Router not imported
- Routes not configured
- Navigation disabled

**Solutions:**
```tsx
// In modal component, verify:
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login'); // Should work
```

---

## Best Practices

### ✅ DO:
```tsx
// ✅ Use HOC for entire pages
export default withLoginRequired(PageComponent);

// ✅ Provide helpful messages
<LoginRequiredModal message="Sign in to manage your orders." />

// ✅ Use consistent titles
title: "My Orders", "My Dashboard", "My Profile"

// ✅ Check auth before expensive operations
if (!userId) return <LoginRequiredModal />;
fetchExpensiveData();
```

### ❌ DON'T:
```tsx
// ❌ Show modal on every render (causes flickering)
render() {
  return <LoginRequiredModal key={Math.random()} />;
}

// ❌ Overly complex messages
message="Please authenticate your digital credentials..."

// ❌ Forget to check Redux is connected
// Always verify: state.auth.userId exists

// ❌ Block navigation without good reason
// Only use for truly authenticated features
```

---

## Performance Tips

### Optimization 1: Memoize Components
```tsx
const MyComponent = React.memo(function MyComponent() {
  return <LoginRequiredModal />;
});
```

### Optimization 2: Use Selector Hooks
```tsx
const userId = useAppSelector(state => state.auth.userId);
// More specific than checking entire auth state
```

### Optimization 3: Lazy Load Protected Content
```tsx
const ProtectedComponent = dynamic(
  () => import('@/components/Protected'),
  { loading: () => <p>Loading...</p> }
);
```

---

## Files Reference

### Component Files
```
components/modals/
├── LoginRequiredModal.tsx    (123 lines) - Main modal component
└── withLoginRequired.tsx     (HOC wrapper)

hooks/
└── useLoginRequired.ts       (Custom auth hook)

redux/
├── authSlice.ts             (Auth state management)
└── hooks.ts                 (Redux hooks: useAppSelector)
```

### Using LoginRequiredModal
```
components/Forms/stores/
└── AddStoreForm.tsx         (Currently uses LoginRequiredModal) ✅

// Should also use:
components/vendors/
components/orders/
components/inventory/
components/agents/
```

---

## Summary

**LoginRequiredModal is your go-to component for:**
- 🔒 Protecting any page or feature
- 👤 Requiring authentication
- 💼 Vendor-only sections
- 📊 Premium features
- 🎯 Role-based access
- 🌍 Application-wide security

**Integration Options:**
1. **Direct component** - Fast, flexible, component-level
2. **HOC wrapper** - Clean, page-level, entire component protection
3. **Custom hook** - Advanced, complex logic, conditional rendering

**Already used in:**
- ✅ AddStoreForm (vendor registration)

**Ready to use in:**
- Dashboard pages
- Customer sections
- Delivery management
- Inventory system
- Admin panels
- Any authenticated feature!

**Get started in 30 seconds:**
```tsx
import { withLoginRequired } from '@/components/modals/withLoginRequired';

export default withLoginRequired(YourComponent, {
  modalTitle: 'Your Feature',
  modalMessage: 'Please log in to access this.'
});
```

🎉 **That's it! Your feature is now protected!** 🎉
