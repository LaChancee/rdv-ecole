# Brainstorming Session Results

**Session Date:** 2026-01-07
**Facilitator:** Business Analyst Mary
**Participant:** Utilisateur

---

## Executive Summary

**Topic:** Système de prise de rendez-vous parents-professeur

**Session Goals:** Définir les fonctionnalités essentielles et l'UX d'une application de prise de rendez-vous pour enseignants — style Calendly mais pour des rencontres en présentiel à l'école.

**Techniques Used:** Role Playing, First Principles, "Yes, And..." Building

**Total Ideas Generated:** 15+

### Key Themes Identified:
- Simplicité absolue — UX épurée façon Calendly/Cal.com
- Zéro friction pour les parents (1 page, quelques clics)
- Automatisation maximale pour la prof (plus d'arbitrage manuel)
- Notifications complètes (confirmation + rappels)
- Flexibilité légère pour les années futures (sessions nommées)

---

## Technique Sessions

### Role Playing — Perspectives Utilisateurs

**Description:** Exploration des besoins en se mettant dans la peau des deux types d'utilisateurs.

#### Perspective Prof (l'enseignante)

**Processus actuel :**
- Tableau papier avec créneaux de 15 min (17h → 18h15)
- Parents mettent 3 croix de préférences
- Prof arbitre manuellement + renvoie l'horaire final via pochette/mail

**Frustrations identifiées :**
1. Système de 3 croix → réponse obligatoire = double travail
2. Conflits de créneaux → arbitrage manuel = prise de tête
3. Densité mal répartie (1 seul RDV isolé un jour) = temps perdu
4. Aller-retour papier/mail = lent et fastidieux

**Idéal prof :**
- Vue calendrier complète : "Lundi 17h = Timoté, 17h15 = Jeanne..."
- Tout est déjà rempli automatiquement, rien à arbitrer

#### Perspective Parent

**Causes d'abandon potentielles :**
- Interface trop compliquée ou pas claire
- Process trop long pour une simple prise de RDV
- Bugs ou comportement illogique

**Besoins essentiels :**
- Voir les créneaux disponibles clairement
- Cliquer → sélectionner jour + horaire
- Entrer son nom (obligatoire)
- Email pour rappel (optionnel)
- Espace commentaire (optionnel)

**Référence UX :** "Comme Calendly/Cal.com" — ultra simple, compact

#### Insights Discovered:
- Le problème principal est l'arbitrage manuel et les allers-retours
- Les parents veulent du "first come, first served" — pas de négociation
- La prof veut une vue consolidée sans effort

---

### First Principles — MVP Minimal

**Description:** Réduction à l'essentiel absolu pour définir le périmètre MVP.

#### Structure identifiée :

**1. Page Parent (unique)**
```
┌─────────────────────────────────┐
│ Maîtresse [Prénom]              │
│ Classe [CE1/CE2...]             │
├─────────────────────────────────┤
│ Créneaux disponibles            │
│ [Grille cliquable]              │
├─────────────────────────────────┤
│ Confirmation                    │
│ • Nom parent* (obligatoire)     │
│ • Prénom enfant* (obligatoire)  │
│ • Email (optionnel)             │
│ • Commentaire (optionnel)       │
│                                 │
│ [Valider]                       │
└─────────────────────────────────┘
```

**2. Page Prof (vue lecture)**
- Liste des RDV pris
- Rappels automatiques
- Historique des sessions
- Pas de gestion/modification (simplicité)

**3. Page Config (création créneaux)**
```
┌─────────────────────────────────────┐
│ Créer une session de RDV            │
├─────────────────────────────────────┤
│ Nom session : [RDV Novembre 2026]   │
│ Plage horaire : [17:00] → [18:15]   │
│ Durée créneau : [15 min]            │
│                                     │
│ Jours : ☑ Lun  ☑ Mar  ☐ Mer  ☑ Jeu  │
│                                     │
│ Semaine du : [06/01/2026]           │
│                                     │
│ [Générer les créneaux]              │
└─────────────────────────────────────┘
```

#### Insights Discovered:
- 3 pages suffisent pour tout le système
- La génération automatique des créneaux est clé
- Sessions nommées permettent de garder l'historique

---

### "Yes, And..." Building — Scénarios

**Description:** Exploration collaborative des cas d'usage et edge cases.

#### Scénarios couverts :

| Scénario | Décision |
|----------|----------|
| Créneau déjà pris | Reste visible mais grisé (pas de confusion avec un bug) |
| Annulation | Non autorisée — réservation définitive |
| Confirmation | Message écran + email parent + notification prof |
| Notification prof | Email + visible dans la page Vue RDV |
| Rappels | Pour prof ET parent (veille/jour J) |
| Identification | Nom parent + prénom enfant (obligatoires) |
| Accès page | Lien simple URL (ex: `/mme-martin`) |
| Multi-sessions | Sessions nommées avec historique |

#### Insights Discovered:
- Pas d'annulation = simplification majeure du code
- Double notification (email + dashboard) = rien n'est loupé
- Lien simple sans authentification = friction minimale

---

## Idea Categorization

### Immediate Opportunities
*Ideas ready to implement now*

1. **Page de réservation parent unique**
   - Description: Une seule page avec infos prof, grille créneaux, formulaire
   - Why immediate: Core du produit, indispensable
   - Resources needed: Next.js + shadcn/ui + Tailwind

2. **Génération automatique de créneaux**
   - Description: Plage horaire + jours → créneaux de 15 min générés
   - Why immediate: Évite la saisie manuelle fastidieuse
   - Resources needed: Logique métier simple

3. **Vue lecture pour la prof**
   - Description: Dashboard simple listant tous les RDV
   - Why immediate: Besoin principal de l'utilisatrice
   - Resources needed: Page Next.js + requêtes BDD

### Future Innovations
*Ideas requiring development/research*

1. **Système de rappels automatiques**
   - Description: Emails J-1 ou jour J pour prof et parents
   - Development needed: CRON job ou service externe (Vercel Cron)
   - Timeline estimate: Post-MVP

2. **Historique des sessions**
   - Description: Archivage et consultation des sessions passées
   - Development needed: Structure BDD adaptée
   - Timeline estimate: V1.1

### Moonshots
*Ambitious, transformative concepts*

1. **Multi-professeurs**
   - Description: Plusieurs enseignants sur la même plateforme
   - Transformative potential: Outil utilisable par toute l'école
   - Challenges to overcome: Auth, isolation des données, onboarding

2. **Intégration calendrier**
   - Description: Sync avec Google Calendar / Outlook
   - Transformative potential: RDV automatiquement dans l'agenda
   - Challenges to overcome: APIs externes, OAuth

### Insights & Learnings
*Key realizations from the session*

- **Simplicité > Fonctionnalités**: Chaque feature ajoutée est une friction potentielle
- **"First come, first served"**: Élimine tout le travail d'arbitrage manuel
- **Pas d'auth parent**: Le lien simple suffit pour ce contexte de confiance (école)
- **Sessions nommées**: Permettent flexibilité sans complexifier l'UX quotidienne

---

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Page de réservation parent
- Rationale: C'est le coeur du produit, ce que les parents utiliseront
- Next steps: Maquette UI → Composants shadcn → Intégration BDD
- Resources needed: Next.js, shadcn/ui, Tailwind, Neon
- Timeline: Sprint 1

#### #2 Priority: Système de création de créneaux
- Rationale: Sans créneaux, pas de réservation possible
- Next steps: UI config → Logique génération → Stockage BDD
- Resources needed: Formulaire shadcn, logique date/heure
- Timeline: Sprint 1

#### #3 Priority: Emails de confirmation
- Rationale: Feedback immédiat = confiance utilisateur
- Next steps: Choix provider (Resend recommandé) → Templates → Intégration
- Resources needed: Resend ou alternative, templates email
- Timeline: Sprint 1-2

---

## Reflection & Follow-up

### What Worked Well
- Role Playing a clarifié les frustrations réelles
- First Principles a éliminé le superflu
- Scénarios "Yes, And" ont couvert les edge cases

### Areas for Further Exploration
- Provider email: Resend vs Mailgun vs autre (coût, facilité)
- Stratégie de rappels: CRON Vercel vs service externe
- URL structure: slug personnalisé vs ID unique

### Recommended Follow-up Techniques
- Wireframing: Maquettes basse fidélité des 3 pages
- User testing: Faire tester le flow à un parent réel

### Questions That Emerged
- Faut-il limiter le nombre de RDV par parent ?
- Que faire si un parent réserve 2 créneaux par erreur ?
- Format exact du rappel (J-1 ? Jour J matin ?)

### Next Session Planning
- **Suggested topics:** Architecture technique détaillée, schéma BDD
- **Recommended timeframe:** Immédiat
- **Preparation needed:** Valider les choix techniques (Resend, structure URL)

---

## Technical Stack Summary

| Élément | Choix |
|---------|-------|
| **Frontend** | Next.js + TypeScript + Tailwind + shadcn/ui |
| **Hébergement** | Vercel |
| **Base de données** | Neon (PostgreSQL) |
| **Emails** | À définir (Resend recommandé) |

---

## Schéma conceptuel des données

```
Sessions
├── id
├── name ("RDV Novembre 2026")
├── teacher_name
├── teacher_class
├── created_at
└── status (active/archived)

Slots
├── id
├── session_id (FK)
├── date
├── start_time
├── end_time
├── is_booked
└── booking_id (FK, nullable)

Bookings
├── id
├── slot_id (FK)
├── parent_name
├── child_firstname
├── email (nullable)
├── comment (nullable)
├── created_at
└── reminder_sent
```

---

*Session facilitated using the BMAD-METHOD brainstorming framework*
