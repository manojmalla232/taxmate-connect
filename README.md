# Taxmate Connect - Production Client Portal

## Overview
A secure, production-ready client portal for managing tax returns, documents, messaging, and user profiles. Built with Next.js, Supabase, TypeScript, shadcn-ui, and Tailwind CSS.

---

## Features
- **Supabase Auth:** Secure login/logout, user session management
- **Profile Management:** View and edit user profiles (name, email, phone, visa type)
- **Tax Returns:** CRUD for tax returns, real-time Supabase data
- **Document Upload:** Upload and preview/download tax documents securely
- **Messaging:** Real-time chat between client and agent, with conversation threads
- **Admin/Agent Dashboard:** Manage clients, view all conversations, and more (optional)
- **Responsive UI:** Modern, mobile-friendly design

---

## Environment Variables
Create a `.env.local` file in the project root with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Setup & Development
```sh
npm install
npm run dev
```
Visit http://localhost:3000 to view the app.

---

## Supabase Setup
- Enable Auth, Storage, and Database (Postgres)
- Set up tables: `profiles`, `tax_returns`, `documents`, `messages`, `conversations`
- Enable Row Level Security (RLS) on all tables
- Configure Storage buckets for document uploads

---

## Deployment
- Deploy on Vercel or your preferred platform
- Set environment variables in your deployment dashboard

---

## Security Checklist
- [x] RLS enabled on all tables
- [x] No sensitive data exposed on frontend
- [x] All API keys are environment variables

---

## Customization & Extensibility
- Add more fields to profiles or tax returns as needed
- Extend agent/admin dashboards
- Add notifications, file previews, or email triggers

---

## Credits
- Built with [Next.js](https://nextjs.org/), [Supabase](https://supabase.com/), [shadcn-ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)

---

## Support
For help, open an issue or contact the maintainer.
