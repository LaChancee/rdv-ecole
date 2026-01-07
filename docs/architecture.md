# RDV-École — Fullstack Architecture Document

## Introduction

Ce document décrit l'architecture complète de **RDV-École**, une application web de prise de rendez-vous parents-professeur. Il sert de référence unique pour le développement.

**Starter Template :** N/A — Projet greenfield basé sur Next.js App Router standard.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-07 | 1.0 | Initial architecture | Winston (Architect) |

---

## High Level Architecture

### Technical Summary

RDV-École est une application fullstack serverless déployée sur Vercel. L'architecture suit le pattern **Jamstack moderne** avec Next.js App Router pour le rendu côté serveur et les Server Actions pour les mutations. La base de données PostgreSQL est hébergée sur Neon (serverless). Les emails sont envoyés via Gmail SMTP avec Nodemailer. L'application est conçue pour être ultra-simple : pas d'authentification complexe, pas de gestion de fichiers, juste de la donnée relationnelle et des notifications email.

### Platform and Infrastructure Choice

**Platform :** Vercel

**Key Services :**
- Vercel (hosting + serverless functions + cron)
- Neon (PostgreSQL serverless)
- Gmail SMTP (emails via Nodemailer)

**Deployment Regions :** Europe (Paris - cdg1) pour la latence optimale en France

**Rationale :**
- Vercel = déploiement zero-config pour Next.js, gratuit pour ce volume
- Neon = PostgreSQL serverless avec tier gratuit généreux (0.5 GB)
- Gmail SMTP = aucun domaine requis, dashboard intégré (Gmail Sent)

### Repository Structure

**Structure :** Monorepo simple (1 projet Next.js)

**Monorepo Tool :** Non nécessaire — projet trop simple

**Package Organization :** Structure Next.js standard avec App Router

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph Users
        Parent[👨‍👩‍👧 Parent]
        Prof[👩‍🏫 Professeur]
    end

    subgraph Vercel
        NextJS[Next.js App]
        ServerActions[Server Actions]
        CronJob[Vercel Cron]
    end

    subgraph External
        Neon[(Neon PostgreSQL)]
        Gmail[Gmail SMTP]
    end

    Parent -->|Réservation| NextJS
    Prof -->|Dashboard| NextJS
    NextJS --> ServerActions
    ServerActions --> Neon
    ServerActions --> Gmail
    CronJob -->|Rappels J-1| ServerActions
```

### Architectural Patterns

- **Jamstack Serverless :** Next.js App Router avec Server Components et Server Actions — _Rationale :_ Zero infrastructure à gérer, scaling automatique, performance optimale
- **Server Components First :** Rendu côté serveur par défaut, Client Components uniquement pour l'interactivité — _Rationale :_ Moins de JavaScript client, meilleur SEO, données fraîches
- **Server Actions for Mutations :** Pas d'API REST séparée, mutations via Server Actions — _Rationale :_ Simplicité maximale, type-safety de bout en bout
- **Repository Pattern Light :** Couche d'accès données avec Drizzle ORM — _Rationale :_ Abstraction propre, facilite les tests et migrations futures

---

## Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.x | Type safety | Détection erreurs à la compilation |
| Frontend Framework | Next.js | 14.x | Fullstack React | App Router, Server Components, Server Actions |
| UI Component Library | shadcn/ui | latest | Composants UI | Accessible, customizable, pas de dépendance runtime |
| CSS Framework | Tailwind CSS | 3.x | Styling | Utility-first, excellent DX avec shadcn |
| State Management | React useState/useOptimistic | built-in | État local | Projet simple, pas besoin de store global |
| Backend Language | TypeScript | 5.x | Type safety | Même langage frontend/backend |
| Backend Framework | Next.js Server Actions | 14.x | API mutations | Intégré, type-safe, simple |
| API Style | Server Actions | N/A | RPC-style mutations | Pas besoin de REST pour ce projet |
| Database | PostgreSQL | 16 | Données relationnelles | Via Neon, robuste et gratuit |
| ORM | Drizzle | latest | Database access | Type-safe, léger, excellent avec Neon |
| Cache | None | N/A | Pas nécessaire | Volume trop faible |
| File Storage | None | N/A | Pas de fichiers | Pas d'images/uploads |
| Authentication | None (lien simple) | N/A | Accès parent | Contexte confiance école |
| Email | Nodemailer + Gmail | latest | Notifications | Gratuit, pas de domaine requis |
| Frontend Testing | Vitest + Testing Library | latest | Unit tests | Rapide, compatible React |
| E2E Testing | Playwright | latest | Tests E2E | Fiable, bonne DX |
| Build Tool | Next.js | 14.x | Build | Intégré |
| Bundler | Turbopack | latest | Dev bundler | Rapide en dev |
| CI/CD | Vercel | N/A | Déploiement auto | Git push = deploy |
| Monitoring | Vercel Analytics | free | Métriques basiques | Inclus gratuitement |

---

## Data Models

### Session

**Purpose :** Représente une période de rendez-vous (ex: "RDV Novembre 2026")

**Key Attributes :**
- `id`: string (cuid) - Identifiant unique
- `name`: string - Nom de la session ("RDV Novembre 2026")
- `slug`: string - URL-friendly identifier ("mme-martin-nov-2026")
- `teacherName`: string - Nom de l'enseignant
- `teacherEmail`: string - Email pour notifications
- `teacherClass`: string - Classe (CE1, CE2...)
- `status`: enum - active | archived
- `createdAt`: timestamp
- `updatedAt`: timestamp

#### TypeScript Interface

```typescript
interface Session {
  id: string;
  name: string;
  slug: string;
  teacherName: string;
  teacherEmail: string;
  teacherClass: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- Has many `Slot`

---

### Slot

**Purpose :** Représente un créneau horaire disponible pour un rendez-vous

**Key Attributes :**
- `id`: string (cuid) - Identifiant unique
- `sessionId`: string (FK) - Session parente
- `date`: date - Date du créneau
- `startTime`: time - Heure de début (17:00)
- `endTime`: time - Heure de fin (17:15)
- `isBooked`: boolean - Réservé ou non
- `createdAt`: timestamp

#### TypeScript Interface

```typescript
interface Slot {
  id: string;
  sessionId: string;
  date: Date;
  startTime: string; // "17:00"
  endTime: string;   // "17:15"
  isBooked: boolean;
  createdAt: Date;
}
```

#### Relationships
- Belongs to `Session`
- Has one optional `Booking`

---

### Booking

**Purpose :** Représente une réservation faite par un parent

**Key Attributes :**
- `id`: string (cuid) - Identifiant unique
- `slotId`: string (FK) - Créneau réservé
- `parentName`: string - Nom du parent
- `childFirstname`: string - Prénom de l'enfant
- `email`: string (nullable) - Email pour confirmation/rappel
- `comment`: string (nullable) - Commentaire optionnel
- `reminderSent`: boolean - Rappel envoyé ou non
- `createdAt`: timestamp

#### TypeScript Interface

```typescript
interface Booking {
  id: string;
  slotId: string;
  parentName: string;
  childFirstname: string;
  email: string | null;
  comment: string | null;
  reminderSent: boolean;
  createdAt: Date;
}
```

#### Relationships
- Belongs to `Slot`

---

### Entity Relationship Diagram

```mermaid
erDiagram
    Session ||--o{ Slot : contains
    Slot ||--o| Booking : has

    Session {
        string id PK
        string name
        string slug UK
        string teacherName
        string teacherEmail
        string teacherClass
        enum status
        timestamp createdAt
        timestamp updatedAt
    }

    Slot {
        string id PK
        string sessionId FK
        date date
        time startTime
        time endTime
        boolean isBooked
        timestamp createdAt
    }

    Booking {
        string id PK
        string slotId FK,UK
        string parentName
        string childFirstname
        string email
        string comment
        boolean reminderSent
        timestamp createdAt
    }
```

---

## API Specification

### Server Actions (pas d'API REST)

Ce projet utilise **Server Actions** au lieu d'une API REST traditionnelle. Voici les actions principales :

```typescript
// ============================================
// SESSION ACTIONS
// ============================================

// Créer une nouvelle session avec ses créneaux
async function createSession(data: {
  name: string;
  teacherName: string;
  teacherEmail: string;
  teacherClass: string;
  slots: {
    date: Date;
    startTime: string;
    endTime: string;
  }[];
}): Promise<Session>

// Récupérer une session par slug (pour page parent)
async function getSessionBySlug(slug: string): Promise<SessionWithSlots | null>

// Récupérer toutes les sessions (pour dashboard prof)
async function getAllSessions(): Promise<Session[]>

// Archiver une session
async function archiveSession(sessionId: string): Promise<void>

// ============================================
// BOOKING ACTIONS
// ============================================

// Créer une réservation
async function createBooking(data: {
  slotId: string;
  parentName: string;
  childFirstname: string;
  email?: string;
  comment?: string;
}): Promise<Booking>

// Récupérer les réservations d'une session
async function getBookingsBySession(sessionId: string): Promise<BookingWithSlot[]>

// ============================================
// EMAIL ACTIONS
// ============================================

// Envoyer confirmation (appelé après createBooking)
async function sendConfirmationEmail(booking: BookingWithDetails): Promise<void>

// Envoyer rappels J-1 (appelé par cron)
async function sendReminderEmails(): Promise<void>
```

---

## Components

### Frontend Components

#### Page de Réservation Parent (`/[slug]`)

**Responsibility :** Afficher les créneaux et permettre la réservation

**Key Interfaces :**
- Affiche infos prof (nom, classe)
- Grille de créneaux (disponibles en vert, pris en gris)
- Formulaire de réservation (nom*, prénom enfant*, email, commentaire)

**Dependencies :** Session data, Slot data, createBooking action

**Technology Stack :** Server Component + Client Component pour le formulaire

---

#### Dashboard Prof (`/dashboard`)

**Responsibility :** Vue des rendez-vous pour l'enseignant

**Key Interfaces :**
- Liste des sessions (active, archivées)
- Vue calendrier des RDV de la session active
- Détails de chaque réservation

**Dependencies :** getAllSessions, getBookingsBySession

**Technology Stack :** Server Component (données fraîches à chaque visite)

---

#### Page Config (`/dashboard/new`)

**Responsibility :** Créer une nouvelle session de RDV

**Key Interfaces :**
- Formulaire : nom session, infos prof
- Sélecteur de plage horaire
- Sélecteur de jours
- Générateur de créneaux

**Dependencies :** createSession action

**Technology Stack :** Client Component (formulaire interactif)

---

### Component Diagram

```mermaid
graph TB
    subgraph Pages
        ParentPage["/[slug]<br/>Page Réservation"]
        DashboardPage["/dashboard<br/>Dashboard Prof"]
        NewSessionPage["/dashboard/new<br/>Nouvelle Session"]
    end

    subgraph Components
        SlotGrid[SlotGrid]
        BookingForm[BookingForm]
        SessionList[SessionList]
        BookingList[BookingList]
        SessionForm[SessionForm]
        SlotGenerator[SlotGenerator]
    end

    subgraph Actions
        createBooking[createBooking]
        createSession[createSession]
        getSessionBySlug[getSessionBySlug]
        getBookingsBySession[getBookingsBySession]
    end

    ParentPage --> SlotGrid
    ParentPage --> BookingForm
    BookingForm --> createBooking

    DashboardPage --> SessionList
    DashboardPage --> BookingList
    SessionList --> getBookingsBySession

    NewSessionPage --> SessionForm
    NewSessionPage --> SlotGenerator
    SessionForm --> createSession
```

---

## External APIs

### Gmail SMTP

- **Purpose :** Envoi d'emails de confirmation et rappels
- **Documentation :** https://nodemailer.com/usage/using-gmail/
- **Authentication :** Gmail App Password (2FA requis sur le compte)
- **Rate Limits :** ~500 emails/jour (largement suffisant)

**Configuration requise :**
```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
```

**Integration Notes :**
- Créer un compte Gmail dédié (`rdv.ecole.notif@gmail.com`)
- Activer 2FA et générer un App Password
- Les emails envoyés sont visibles dans "Sent" = dashboard gratuit

---

## Core Workflows

### Workflow 1 : Réservation d'un créneau

```mermaid
sequenceDiagram
    participant P as Parent
    participant App as Next.js App
    participant DB as Neon DB
    participant Email as Gmail SMTP

    P->>App: Ouvre /mme-martin-nov-2026
    App->>DB: getSessionBySlug(slug)
    DB-->>App: Session + Slots
    App-->>P: Affiche grille créneaux

    P->>App: Sélectionne créneau 17:00
    P->>App: Remplit formulaire + Submit
    App->>DB: BEGIN TRANSACTION
    App->>DB: Check slot.isBooked = false
    alt Créneau disponible
        App->>DB: INSERT booking
        App->>DB: UPDATE slot SET isBooked = true
        App->>DB: COMMIT
        App->>Email: sendConfirmationEmail()
        Email-->>P: Email confirmation
        App-->>P: "RDV confirmé !"
    else Créneau déjà pris
        App->>DB: ROLLBACK
        App-->>P: "Ce créneau vient d'être pris"
    end
```

### Workflow 2 : Envoi des rappels J-1

```mermaid
sequenceDiagram
    participant Cron as Vercel Cron
    participant App as Next.js App
    participant DB as Neon DB
    participant Email as Gmail SMTP

    Cron->>App: GET /api/cron/reminders (chaque jour 18h)
    App->>DB: SELECT bookings WHERE date = tomorrow AND reminderSent = false
    DB-->>App: Liste des RDV de demain

    loop Pour chaque booking
        App->>Email: sendReminderEmail(booking)
        App->>DB: UPDATE booking SET reminderSent = true
    end

    App->>Email: sendTeacherDailySummary()
    App-->>Cron: 200 OK
```

---

## Database Schema

```sql
-- Sessions de rendez-vous
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    teacher_name TEXT NOT NULL,
    teacher_email TEXT NOT NULL,
    teacher_class TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche par slug
CREATE INDEX idx_sessions_slug ON sessions(slug);
CREATE INDEX idx_sessions_status ON sessions(status);

-- Créneaux horaires
CREATE TABLE slots (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(session_id, date, start_time)
);

-- Index pour filtrage
CREATE INDEX idx_slots_session ON slots(session_id);
CREATE INDEX idx_slots_date ON slots(date);
CREATE INDEX idx_slots_available ON slots(session_id, is_booked) WHERE is_booked = FALSE;

-- Réservations
CREATE TABLE bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id TEXT NOT NULL UNIQUE REFERENCES slots(id) ON DELETE CASCADE,
    parent_name TEXT NOT NULL,
    child_firstname TEXT NOT NULL,
    email TEXT,
    comment TEXT,
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour rappels
CREATE INDEX idx_bookings_reminder ON bookings(reminder_sent) WHERE reminder_sent = FALSE;
```

---

## Frontend Architecture

### Component Organization

```
src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # Page réservation parent
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard prof
│   │   └── new/
│   │       └── page.tsx          # Créer session
│   ├── api/
│   │   └── cron/
│   │       └── reminders/
│   │           └── route.ts      # Cron rappels
│   ├── layout.tsx
│   ├── page.tsx                  # Redirect ou landing
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── slot-grid.tsx
│   ├── booking-form.tsx
│   ├── session-form.tsx
│   ├── session-list.tsx
│   └── booking-list.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts              # Drizzle client
│   │   └── schema.ts             # Drizzle schema
│   ├── actions/
│   │   ├── sessions.ts
│   │   ├── bookings.ts
│   │   └── emails.ts
│   ├── email.ts                  # Nodemailer config
│   └── utils.ts
└── types/
    └── index.ts                  # Types partagés
```

### Component Template

```typescript
// Exemple : SlotGrid (Server Component avec Client interactivity)
import { Slot } from '@/types';
import { SlotButton } from './slot-button';

interface SlotGridProps {
  slots: Slot[];
  onSelectSlot: (slotId: string) => void;
  selectedSlotId: string | null;
}

export function SlotGrid({ slots, onSelectSlot, selectedSlotId }: SlotGridProps) {
  // Grouper par date
  const slotsByDate = groupBy(slots, 'date');

  return (
    <div className="space-y-4">
      {Object.entries(slotsByDate).map(([date, dateSlots]) => (
        <div key={date}>
          <h3 className="font-medium">{formatDate(date)}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {dateSlots.map((slot) => (
              <SlotButton
                key={slot.id}
                slot={slot}
                isSelected={selectedSlotId === slot.id}
                onSelect={() => onSelectSlot(slot.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### State Management Patterns

- **Server State :** Données fraîches via Server Components (pas de cache client)
- **Form State :** `useFormState` + `useFormStatus` pour les Server Actions
- **UI State :** `useState` local pour sélection de créneau, modals
- **Optimistic Updates :** `useOptimistic` pour feedback immédiat sur réservation

### Routing Architecture

```
/                           → Redirect vers /dashboard ou landing
/[slug]                     → Page réservation parent (dynamique)
/dashboard                  → Dashboard prof (sessions + RDV)
/dashboard/new              → Créer nouvelle session
/dashboard/[sessionId]      → Détails d'une session
/api/cron/reminders         → Endpoint pour Vercel Cron
```

### Protected Route Pattern

```typescript
// Pour le dashboard prof (protection simple par variable d'env)
// Note: pas d'auth complexe, juste un secret dans l'URL ou cookie

// middleware.ts (optionnel pour MVP)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    // Pour le MVP : pas de protection
    // V2 : ajouter auth basique (magic link ou password simple)
  }

  return NextResponse.next();
}
```

### API Client Setup

```typescript
// Pas d'API client traditionnel - on utilise Server Actions

// lib/actions/bookings.ts
'use server';

import { db } from '@/lib/db';
import { bookings, slots } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { sendConfirmationEmail } from './emails';

export async function createBooking(formData: FormData) {
  const slotId = formData.get('slotId') as string;
  const parentName = formData.get('parentName') as string;
  const childFirstname = formData.get('childFirstname') as string;
  const email = formData.get('email') as string | null;
  const comment = formData.get('comment') as string | null;

  // Transaction pour éviter les race conditions
  const result = await db.transaction(async (tx) => {
    // Vérifier que le créneau est disponible
    const slot = await tx.query.slots.findFirst({
      where: eq(slots.id, slotId),
    });

    if (!slot || slot.isBooked) {
      throw new Error('Ce créneau n\'est plus disponible');
    }

    // Créer la réservation
    const [booking] = await tx.insert(bookings).values({
      slotId,
      parentName,
      childFirstname,
      email,
      comment,
    }).returning();

    // Marquer le créneau comme réservé
    await tx.update(slots)
      .set({ isBooked: true })
      .where(eq(slots.id, slotId));

    return booking;
  });

  // Envoyer email de confirmation
  if (email) {
    await sendConfirmationEmail(result);
  }

  revalidatePath('/[slug]');
  return { success: true, booking: result };
}
```

---

## Backend Architecture

### Service Architecture (Serverless)

#### Function Organization

```
src/
├── lib/
│   ├── db/
│   │   ├── index.ts          # Drizzle client singleton
│   │   ├── schema.ts         # Tables definition
│   │   └── migrations/       # SQL migrations
│   ├── actions/
│   │   ├── sessions.ts       # Session CRUD
│   │   ├── bookings.ts       # Booking CRUD
│   │   └── emails.ts         # Email sending
│   ├── email.ts              # Nodemailer transporter
│   └── utils.ts              # Helpers
└── app/
    └── api/
        └── cron/
            └── reminders/
                └── route.ts  # Cron endpoint
```

#### Function Template

```typescript
// lib/actions/sessions.ts
'use server';

import { db } from '@/lib/db';
import { sessions, slots } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateSlug } from '@/lib/utils';

interface CreateSessionInput {
  name: string;
  teacherName: string;
  teacherEmail: string;
  teacherClass: string;
  slotConfig: {
    dates: Date[];
    startTime: string;
    endTime: string;
    duration: number; // minutes
  };
}

export async function createSession(input: CreateSessionInput) {
  const slug = generateSlug(input.teacherName, input.name);

  // Générer les créneaux
  const generatedSlots = generateTimeSlots(input.slotConfig);

  const result = await db.transaction(async (tx) => {
    // Créer la session
    const [session] = await tx.insert(sessions).values({
      name: input.name,
      slug,
      teacherName: input.teacherName,
      teacherEmail: input.teacherEmail,
      teacherClass: input.teacherClass,
    }).returning();

    // Créer les créneaux
    await tx.insert(slots).values(
      generatedSlots.map((slot) => ({
        sessionId: session.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))
    );

    return session;
  });

  revalidatePath('/dashboard');
  return result;
}
```

### Database Access Layer

```typescript
// lib/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, date, time, boolean, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  teacherName: text('teacher_name').notNull(),
  teacherEmail: text('teacher_email').notNull(),
  teacherClass: text('teacher_class').notNull(),
  status: text('status', { enum: ['active', 'archived'] }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const slots = pgTable('slots', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  isBooked: boolean('is_booked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueSlot: unique().on(table.sessionId, table.date, table.startTime),
}));

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slotId: text('slot_id').notNull().unique().references(() => slots.id, { onDelete: 'cascade' }),
  parentName: text('parent_name').notNull(),
  childFirstname: text('child_firstname').notNull(),
  email: text('email'),
  comment: text('comment'),
  reminderSent: boolean('reminder_sent').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const sessionsRelations = relations(sessions, ({ many }) => ({
  slots: many(slots),
}));

export const slotsRelations = relations(slots, ({ one }) => ({
  session: one(sessions, {
    fields: [slots.sessionId],
    references: [sessions.id],
  }),
  booking: one(bookings, {
    fields: [slots.id],
    references: [bookings.slotId],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  slot: one(slots, {
    fields: [bookings.slotId],
    references: [slots.id],
  }),
}));
```

### Authentication (Simplifiée)

```mermaid
sequenceDiagram
    participant Parent
    participant Prof
    participant App

    Note over Parent,App: Parents - Pas d'auth
    Parent->>App: GET /mme-martin-nov-2026
    App-->>Parent: Page réservation publique

    Note over Prof,App: Prof - Auth basique (MVP)
    Prof->>App: GET /dashboard
    App-->>Prof: Dashboard (pas de protection MVP)

    Note over Prof,App: V2: Magic link ou password
```

Pour le MVP : pas d'authentification sur le dashboard. L'URL n'est pas partagée publiquement.

---

## Unified Project Structure

```
rdv-ecole/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Lint + Type check
├── src/
│   ├── app/
│   │   ├── [slug]/
│   │   │   └── page.tsx              # Page réservation parent
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard prof
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Créer session
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx          # Détails session
│   │   ├── api/
│   │   │   └── cron/
│   │   │       └── reminders/
│   │   │           └── route.ts      # Cron rappels
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Landing/redirect
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── slot-grid.tsx
│   │   ├── booking-form.tsx
│   │   ├── session-form.tsx
│   │   ├── session-list.tsx
│   │   └── booking-list.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client
│   │   │   ├── schema.ts             # Schema definition
│   │   │   └── migrations/           # SQL migrations
│   │   ├── actions/
│   │   │   ├── sessions.ts
│   │   │   ├── bookings.ts
│   │   │   └── emails.ts
│   │   ├── email.ts                  # Nodemailer config
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
│   └── favicon.ico
├── docs/
│   ├── brief.md
│   ├── brainstorming-session-results.md
│   └── architecture.md
├── .env.example
├── .env.local                        # (gitignored)
├── .gitignore
├── components.json                   # shadcn/ui config
├── drizzle.config.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Development Workflow

### Prerequisites

```bash
# Node.js 18+ requis
node --version  # v18.x ou v20.x

# Package manager
npm --version   # ou pnpm/yarn
```

### Initial Setup

```bash
# Cloner et installer
git clone <repo>
cd rdv-ecole
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec tes credentials

# Initialiser la base de données
npx drizzle-kit push

# Lancer en dev
npm run dev
```

### Development Commands

```bash
# Démarrer le serveur de dev
npm run dev

# Type check
npm run type-check

# Linting
npm run lint

# Build production
npm run build

# Générer/appliquer migrations
npx drizzle-kit generate
npx drizzle-kit push

# Studio Drizzle (GUI pour la BDD)
npx drizzle-kit studio
```

### Environment Configuration

```bash
# .env.local

# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/rdvecole?sslmode=require"

# Gmail SMTP
GMAIL_USER="rdv.ecole.notif@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cron secret (pour sécuriser l'endpoint)
CRON_SECRET="random-secret-string"
```

---

## Deployment Architecture

### Deployment Strategy

**Frontend + Backend Deployment :** Vercel (unified)
- **Build Command :** `npm run build`
- **Output Directory :** `.next`
- **CDN/Edge :** Vercel Edge Network automatique

**Cron Jobs :** Vercel Cron
- Configuration dans `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 18 * * *"
    }
  ]
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
```

Vercel gère le déploiement automatique sur push to main.

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | http://localhost:3000 | Local dev |
| Preview | https://rdv-ecole-xxx.vercel.app | PR previews |
| Production | https://rdv-ecole.vercel.app | Live |

---

## Security and Performance

### Security Requirements

**Frontend Security :**
- CSP Headers : Configurés via `next.config.js`
- XSS Prevention : React échappe par défaut, pas de `dangerouslySetInnerHTML`
- Secure Storage : Pas de données sensibles côté client

**Backend Security :**
- Input Validation : Zod pour valider tous les inputs
- Rate Limiting : Vercel a un rate limiting intégré
- CORS Policy : Same-origin (pas d'API externe consommée)

**Database Security :**
- Parameterized queries via Drizzle (pas d'injection SQL)
- Connection SSL obligatoire (Neon)

**Cron Security :**
```typescript
// app/api/cron/reminders/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... logique rappels
}
```

### Performance Optimization

**Frontend Performance :**
- Bundle Size Target : < 100KB JS initial
- Loading Strategy : Server Components par défaut
- Caching : Revalidation on-demand via `revalidatePath`

**Backend Performance :**
- Response Time Target : < 200ms p95
- Database : Neon serverless avec connection pooling
- Cold starts : Minimisés par l'architecture Next.js

---

## Testing Strategy

### Testing Pyramid

```
        E2E (Playwright)
       /              \
    Integration Tests
   /                  \
  Component Tests    Action Tests
```

### Test Organization

```
src/
├── __tests__/
│   ├── components/
│   │   ├── slot-grid.test.tsx
│   │   └── booking-form.test.tsx
│   ├── actions/
│   │   ├── bookings.test.ts
│   │   └── sessions.test.ts
│   └── e2e/
│       ├── booking-flow.spec.ts
│       └── dashboard.spec.ts
```

### Test Examples

#### Component Test

```typescript
// __tests__/components/slot-grid.test.tsx
import { render, screen } from '@testing-library/react';
import { SlotGrid } from '@/components/slot-grid';

describe('SlotGrid', () => {
  const mockSlots = [
    { id: '1', date: '2026-01-10', startTime: '17:00', endTime: '17:15', isBooked: false },
    { id: '2', date: '2026-01-10', startTime: '17:15', endTime: '17:30', isBooked: true },
  ];

  it('renders available slots as clickable', () => {
    render(<SlotGrid slots={mockSlots} onSelectSlot={jest.fn()} selectedSlotId={null} />);

    const availableSlot = screen.getByText('17:00');
    expect(availableSlot).not.toBeDisabled();
  });

  it('renders booked slots as disabled', () => {
    render(<SlotGrid slots={mockSlots} onSelectSlot={jest.fn()} selectedSlotId={null} />);

    const bookedSlot = screen.getByText('17:15');
    expect(bookedSlot).toBeDisabled();
  });
});
```

#### E2E Test

```typescript
// __tests__/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test('parent can book an available slot', async ({ page }) => {
  await page.goto('/mme-martin-nov-2026');

  // Vérifier que la page affiche les infos prof
  await expect(page.getByText('Mme Martin')).toBeVisible();

  // Sélectionner un créneau
  await page.getByRole('button', { name: '17:00' }).click();

  // Remplir le formulaire
  await page.getByLabel('Nom du parent').fill('Dupont');
  await page.getByLabel('Prénom de l\'enfant').fill('Lucas');
  await page.getByLabel('Email').fill('dupont@email.com');

  // Soumettre
  await page.getByRole('button', { name: 'Confirmer' }).click();

  // Vérifier la confirmation
  await expect(page.getByText('Rendez-vous confirmé')).toBeVisible();
});
```

---

## Coding Standards

### Critical Fullstack Rules

- **Server Actions Only :** Toutes les mutations passent par Server Actions, pas d'API routes custom
- **Type Safety :** Tout est typé, pas de `any`
- **Validation :** Utiliser Zod pour valider les inputs côté serveur
- **Error Handling :** Toujours retourner `{ success: boolean, error?: string }` des actions
- **Revalidation :** Appeler `revalidatePath` après chaque mutation

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `SlotGrid.tsx` |
| Server Actions | camelCase | `createBooking.ts` |
| Database tables | snake_case | `teacher_class` |
| URL slugs | kebab-case | `/mme-martin-nov-2026` |
| Env variables | SCREAMING_SNAKE | `DATABASE_URL` |

---

## Error Handling Strategy

### Error Response Format

```typescript
// Types d'erreur standardisés
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Exemple d'utilisation
export async function createBooking(formData: FormData): Promise<ActionResult<Booking>> {
  try {
    // ... logique
    return { success: true, data: booking };
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return { success: false, error: 'Ce créneau n\'est plus disponible' };
    }
    return { success: false, error: 'Une erreur est survenue' };
  }
}
```

### Frontend Error Handling

```typescript
// Composant avec gestion d'erreur
'use client';

import { useFormState } from 'react-dom';
import { createBooking } from '@/lib/actions/bookings';

export function BookingForm({ slotId }: { slotId: string }) {
  const [state, formAction] = useFormState(createBooking, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="slotId" value={slotId} />
      {/* ... autres champs */}

      {state?.success === false && (
        <p className="text-red-500">{state.error}</p>
      )}

      {state?.success === true && (
        <p className="text-green-500">Rendez-vous confirmé !</p>
      )}

      <SubmitButton />
    </form>
  );
}
```

---

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring :** Vercel Analytics (gratuit, inclus)
- **Backend Monitoring :** Vercel Functions logs
- **Error Tracking :** Console logs (V2: Sentry si besoin)
- **Performance Monitoring :** Vercel Speed Insights

### Key Metrics

**Frontend Metrics :**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors (console)
- Page views

**Backend Metrics :**
- Function invocations
- Error rate
- Response time (via Vercel dashboard)

---

## Checklist Results Report

_À compléter après exécution de la checklist architecte._

---

*Document généré le 2026-01-07 — Winston (Architect Agent)*
