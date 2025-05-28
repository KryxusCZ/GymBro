# GymBro

## Overview

**GymBro** is a modern fitness tracking web application for athletes and coaches.  
Track your workouts, set goals, monitor progress, and manage your fitness journey with beautiful analytics and a clean UI.

---

## Features

- 🏋️ **Workout Tracking**: Log workouts, exercises, sets, reps, and weights.
- 🎯 **Goal Setting**: Create, track, and visualize your fitness goals.
- 📊 **Analytics**: View detailed progress charts and metrics.
- 🗓️ **Calendar**: Plan and review your training sessions.
- 👥 **Coach & Athlete Modes**: Dual-perspective dashboard for both roles.
- 🔒 **Authentication**: Secure login and registration.
- ⚡ **Responsive UI**: Built with shadcn-ui and Tailwind CSS.

---

## Tech Stack

- [Vite](https://vitejs.dev/) – Fast React development
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/) – UI components
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
- [Supabase](https://supabase.com/) – Auth & Database
- [React Query](https://tanstack.com/query/latest) – Data fetching/caching

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   ```
   http://localhost:****/
   ```

---

## Project Structure


## README part for Tvorba webových aplikací III
## ✅ Implementováno

- Vícevrstvá architektura (UI – Services – Supabase DB)
- Datové modely: Workout, Goal, User, Exercise
- Autentizace pomocí Supabase Auth (JWT)
- Role-based přístup: Coach vs. Athlete
- Validace vstupních dat: `zod`, `react-hook-form`
- Uživatelská dokumentace s obrázky
- Automatická aktualizace cílů dle historie tréninků

## 🚧 Chybí / plánované

- Server-side logování (závislé na produkčním backendu)
- Monitoring provozu (bude řešeno v nasazení)
- Generovaná dokumentace API (neaplikovatelné pro Supabase)



Zaměření a cíl práce:
✔️ Webová aplikace s rozdělením pro athlety a trenéry

✔️ Hlavní funkčnost: správa tréninků, cílů, analýzy, přehled výkonu

✔️ Projekt má backend (Supabase), frontend (React/Vite.js), a validní datový model

🔹 Architektura a vrstvy:
✔️ Aplikace využívá logickou strukturu:

entity (datové objekty ve stylu Supabase tabulek),

služby (saveWorkoutToDatabase, updateWorkoutInDatabase...),

kontrolery ve smyslu stránek/formulářů

✔️ Separace odpovědnosti: Logika není ve vizuální vrstvě (např. WorkoutForm volá služby)

✔️ Použití Tailwind CSS pro stylování – komponenty jsou oddělené

🔹 Bezpečnost:
✔️ Používáš Supabase Auth

✔️ Autentizace je implementována (useAuth a privátní routy)

✔️ Role-based přístup (athlete vs. coach)

🔹 Validace a UX:
✔️ Využití zod + react-hook-form pro validaci na klientovi

✔️ Zobrazování validace ve formulářích

✔️ API komunikace s elegantním fallbackem (toast.error, logování do konzole)

🔹 UI/UX a dokumentace uživatelská:
✔️ Uživatelské příručky, s obrázky a popisem

✔️ Design aplikace zaměřený na jednoduchost a použitelnost

❌ Chybí nebo je potřeba doplnit:
Požadavek	                                                                        Chybějící/Doplnit	                                                                                       Návrh řešení
Vrstvená architektura – backend	                                  🔸 Nemáš tradiční backend (např. Node.js s Express, Spring...)	                ✅ Používám Supabase jako BaaS (Backend-as-a-Service) 

DTO/DAO rozhraní	                                                 🔸 Nemáš explicitní DTO nebo repository pattern	                               ✅ WorkoutFormValues nebo WorkoutWithExercises slouží                                                                                                                                                          jako přenosové objekty mezi UI a DB
Logování a monitoring	                                           🔴 Chybí serverové logování, health-check, error monitoring	                   ✅ Supabase loguje události na serveru automaticky
Validace vstupů na backendu	                                     🔴 Supabase nemá vlastní validaci nad sloupci, validuješ jen v Reactu	          ✅ Je to limitaci BaaS 
Generovaná API dokumentace (Swagger, Redoc)                        🔴 Nemám backend s OpenAPI – není co dokumentovat	                               ✅ Backend zajišťuje Supabase, API není veřejné,                                                                                                                                                               interakce probíhá přes client SDK
Monitoring	                                                       🔴 Není health-check endpoint ani uptime sledování	                            ✅ Plánuju integraci (např. Vercel analytics nebo                                                                                                                                                              Sentry) v produkčním nasazení
