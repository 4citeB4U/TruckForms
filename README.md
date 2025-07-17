
# TruckForms

## What is TruckForms?

TruckForms is a modern SaaS platform built for the logistics and trucking industry. It transforms how companies, drivers, dispatchers, managers, and trainers handle paperwork, compliance, and operational documentation. TruckForms replaces outdated paper forms and fragmented spreadsheets with a secure, digital, and intelligent forms engine.

---

## Why TruckForms Exists

Logistics companies face constant challenges with paperwork: compliance, audits, lost documents, slow reporting, and manual errors. TruckForms solves these problems by:

- **Digitizing every form** needed for trucking operations, compliance, and training.
- **Centralizing data** so companies never lose a document and can access records instantly.
- **Automating workflows** with AI-powered autofill, validation, and smart logic.
- **Enabling mobile-first access** for drivers and staff in the field.
- **Providing secure, company-specific workspaces** for multi-tenancy and data isolation.
- **Supporting e-signatures, PDF export, and integrations** for seamless operations.

---

## What TruckForms Provides

### For Companies
- **Company Management:** Create and manage your own company workspace. Invite users, assign roles, and control access.
- **Multi-Tenancy:** Each company’s data, branding, and forms are isolated and secure.
- **Branding Customization:** Upload your logo and colors for a native experience.
- **Compliance & Audit:** All forms are stored, searchable, and exportable for audits and legal requirements.
- **Role-Based Access:** Admins, managers, drivers, and trainers have tailored permissions and dashboards.
- **Integrations:** Connect TruckForms to payroll, HR, safety, and other business systems via API and webhooks.
- **Billing & SaaS:** Subscription plans for every size, with usage metering and invoices.

### For Users (Drivers, Dispatchers, Managers, Trainers)
- **Easy Form Access:** Fill out, sign, and submit forms from any device.
- **AI Autofill:** Reduce manual entry and errors with smart suggestions and pre-population.
- **Conditional Logic:** Only see relevant fields based on your answers.
- **E-Signatures:** Sign forms digitally, no printing required.
- **Instant Submission:** Data is saved and available to your company instantly.
- **Mobile-First:** Designed for clarity and speed on phones and tablets.

---

## How TruckForms Works

1. **Authentication & Company Creation:**
   - Users sign up and join or create a company.
   - Each company has its own workspace, branding, and user management.

2. **Role Assignment:**
   - Admins invite users and assign roles (admin, manager, driver, etc.).
   - Permissions are enforced throughout the app.

3. **Form Engine:**
   - Hundreds of logistics forms are available, organized by role and purpose.
   - Forms use conditional logic, validation, and AI autofill.
   - E-signature and PDF export are built-in.

4. **Data Storage & Security:**
   - All submissions are stored in Firestore, scoped to each company.
   - Data is encrypted, access-controlled, and audit-logged.

5. **Integrations & API:**
   - REST/GraphQL API and webhooks for connecting to other business systems.
   - OAuth and API key support for secure external access.

6. **Billing & SaaS Features:**
   - Stripe integration for subscriptions, metering, and invoices.
   - Usage analytics and admin dashboard.

---

## Why Companies Want TruckForms

- **Save Time:** Eliminate manual paperwork, reduce errors, and speed up reporting.
- **Stay Compliant:** Always have the right forms, signatures, and records for DOT, FMCSA, and audits.
- **Empower Teams:** Drivers, dispatchers, and managers get the tools they need, wherever they are.
- **Scale Easily:** Add users, companies, and integrations as you grow.
- **Secure Data:** Company data is isolated, encrypted, and always available.
- **Modernize Operations:** Move to a cloud-native, mobile-first, AI-powered workflow.

---

## Technology Stack

- **Next.js** (React, TypeScript)
- **Firebase** (Auth, Firestore, Storage)
- **Radix UI, Lucide Icons, Tailwind CSS**
- **Stripe** (billing)
- **Genkit AI** (autofill, command parsing)

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint & Typecheck
```bash
npm run lint
npm run typecheck
```

---

## Project Structure

- `src/components/forms/` - All form components
- `src/ai/` - AI flows for autofill and command parsing
- `src/actions/` - Server actions
- `src/context/` - React context providers
- `src/hooks/` - Custom hooks
- `src/lib/` - Constants, types, and utilities
- `src/auth/` - Authentication and company management
- `docs/` - Project documentation and blueprint

---

## License

MIT

