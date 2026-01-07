# Project Brief: RDV-École

## Executive Summary

**RDV-École** est une application web minimaliste de prise de rendez-vous parents-professeur. Elle permet aux parents d'élèves de réserver directement un créneau avec l'enseignant(e) sur une page simple — sans aller-retour, sans arbitrage manuel.

**Problème principal :** Le système actuel (tableau papier + 3 croix de préférence + arbitrage manuel) génère du double travail pour l'enseignant et de la confusion pour les parents.

**Marché cible :** Enseignants du primaire en France (initialement : usage personnel pour une enseignante).

**Proposition de valeur :** "Premier arrivé, premier servi" — le parent clique, le créneau est réservé, c'est terminé.

---

## Problem Statement

### Situation actuelle

Les enseignants du primaire organisent plusieurs fois par an des rendez-vous individuels avec les parents d'élèves. Le processus typique :

1. L'enseignant crée un tableau papier avec les créneaux disponibles
2. Les parents indiquent 3 préférences (croix sur le tableau)
3. L'enseignant arbitre manuellement les conflits
4. L'enseignant renvoie l'horaire définitif à chaque parent
5. Communication via pochette/cahier de liaison ou email

### Pain Points identifiés

| Problème | Impact |
|----------|--------|
| Système de 3 préférences | Double travail — réponse obligatoire pour chaque parent |
| Conflits de créneaux | Arbitrage manuel fastidieux |
| Densité mal répartie | Journées avec 1 seul RDV isolé = temps perdu |
| Allers-retours papier/mail | Process lent et source d'erreurs |

### Pourquoi les solutions existantes ne conviennent pas

- **Calendly / Cal.com** : Conçus pour des meetings pro/visio, trop complexes pour ce cas d'usage, payants pour les fonctionnalités avancées
- **Doodle** : Sondage de disponibilités, pas de réservation ferme
- **Google Forms** : Pas de blocage automatique des créneaux pris

### Urgence

Les rendez-vous parents-professeur sont une obligation récurrente (3-4 fois/an). Chaque session représente plusieurs heures de travail administratif évitable.

---

## Proposed Solution

### Concept

Une application web en 3 pages :
1. **Page Parent** — Réservation en autonomie (1 page, quelques clics)
2. **Page Prof** — Vue lecture des rendez-vous
3. **Page Config** — Création des sessions et créneaux

### Différenciateurs clés

| Aspect | RDV-École | Calendly/Cal.com |
|--------|-----------|------------------|
| Complexité | Ultra-simple, 1 page | Interface pro complète |
| Coût | Gratuit (hébergement Vercel) | Freemium limité |
| Contexte | Présentiel école | Visio/meetings pro |
| Auth parent | Aucune (lien simple) | Compte ou email requis |

### Pourquoi ça marchera

- **Simplicité radicale** : Moins de fonctionnalités = moins de friction
- **"First come, first served"** : Élimine 100% de l'arbitrage manuel
- **Adapté au contexte** : Pensé pour l'école, pas adapté d'un outil pro

---

## Target Users

### Primary User Segment: Enseignant(e) du primaire

**Profil :**
- Professeur des écoles en France
- Classe de 20-30 élèves
- Organise 3-4 sessions de RDV parents/an
- Peu de temps pour l'administratif
- Confort variable avec les outils numériques

**Comportements actuels :**
- Utilise le tableau papier par habitude
- Communique via pochette et/ou email
- Passe plusieurs heures à arbitrer les créneaux

**Besoins :**
- Vue consolidée de tous les RDV ("Lundi 17h = Timoté")
- Zéro arbitrage manuel
- Rappels pour ne rien oublier
- Historique des sessions passées

**Goals :**
- Réduire le temps administratif
- Avoir une visibilité claire sur son planning

---

### Secondary User Segment: Parent d'élève

**Profil :**
- Parent d'un élève de primaire
- Consulte la page sur mobile, souvent le soir
- Peu de temps, veut aller vite
- Pas forcément à l'aise avec le numérique

**Comportements actuels :**
- Reçoit le tableau, met 3 croix
- Attend la réponse de l'enseignant
- Parfois oublie le RDV faute de rappel

**Besoins :**
- Voir les créneaux disponibles clairement
- Réserver en quelques clics
- Confirmation immédiate
- Rappel avant le RDV

**Goals :**
- Choisir un créneau qui convient
- Ne pas oublier le rendez-vous

---

## Goals & Success Metrics

### Business Objectives

- Réduire le temps d'organisation des RDV de 80% pour l'enseignant
- Atteindre 100% de réservations en autonomie (0 arbitrage manuel)
- Zéro RDV oublié grâce aux rappels

### User Success Metrics

- Temps de réservation parent < 2 minutes
- Taux de complétion du formulaire > 95%
- Taux d'ouverture des emails de rappel > 70%

### Key Performance Indicators (KPIs)

- **Nombre de réservations** : Total de RDV pris via l'application
- **Taux d'abandon** : Parents qui commencent mais ne finalisent pas (cible < 5%)
- **Conflits de créneaux** : Devrait être 0 (système first-come-first-served)

---

## MVP Scope

### Core Features (Must Have)

- **Page de réservation parent** : 1 page unique avec infos prof, grille de créneaux cliquables, formulaire (nom parent*, prénom enfant*, email, commentaire)
- **Système de créneaux** : Créneaux de 15 min, blocage automatique à la réservation, créneaux pris visibles mais grisés
- **Confirmation** : Message à l'écran + email au parent + notification email à la prof
- **Vue prof** : Liste de tous les RDV de la session active
- **Config créneaux** : Interface simple pour générer des créneaux (plage horaire + jours + durée)
- **Sessions nommées** : Possibilité de créer "RDV Novembre", "RDV Mars", etc.
- **Rappels** : Email J-1 pour prof et parent

### Out of Scope for MVP

- Authentification/comptes utilisateurs
- Annulation de RDV par le parent
- Modification de créneau après réservation
- Multi-professeurs / multi-écoles
- Intégration calendrier (Google, Outlook)
- Application mobile native
- SMS de rappel
- Paiement / modèle premium

### MVP Success Criteria

Le MVP est un succès si :
1. L'enseignante peut créer une session de RDV en < 5 minutes
2. Les parents peuvent réserver sans assistance
3. L'enseignante voit tous ses RDV consolidés sans effort
4. Les rappels sont envoyés automatiquement

---

## Post-MVP Vision

### Phase 2 Features

- **Multi-classes** : Un enseignant avec plusieurs niveaux (CE1/CE2)
- **Rappels personnalisables** : Choix J-1, J-2, ou jour J matin
- **Export** : Télécharger la liste des RDV en PDF/CSV
- **Statistiques** : Taux de participation, créneaux populaires

### Long-term Vision

- **Multi-professeurs** : Plusieurs enseignants d'une même école sur la plateforme
- **Vue école** : Dashboard pour la direction
- **Intégration ENT** : Connexion avec les espaces numériques de travail des écoles

### Expansion Opportunities

- Adaptation pour collèges/lycées (conseils de classe)
- Version "professionnels de santé" (orthophonistes, psychologues scolaires)
- Marque blanche pour les mairies/académies

---

## Technical Considerations

### Platform Requirements

- **Target Platforms :** Web responsive (desktop + mobile)
- **Browser Support :** Chrome, Firefox, Safari, Edge (versions récentes)
- **Performance Requirements :** First Contentful Paint < 1.5s, Time to Interactive < 3s

### Technology Preferences

- **Frontend :** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend :** Next.js API Routes / Server Actions
- **Database :** Neon (PostgreSQL serverless)
- **Hosting/Infrastructure :** Vercel (gratuit pour ce volume)
- **Emails :** Gmail SMTP via Nodemailer (compte dédié, ~500/jour, dashboard = Gmail Sent)

### Architecture Considerations

- **Repository Structure :** Monorepo simple (1 projet Next.js)
- **Service Architecture :** Fullstack Next.js, pas de backend séparé
- **Integration Requirements :** Service email (Resend), CRON pour rappels (Vercel Cron)
- **Security/Compliance :** HTTPS par défaut (Vercel), pas de données sensibles stockées

---

## Constraints & Assumptions

### Constraints

- **Budget :** 0€ — projet bénévole, uniquement services gratuits
- **Timeline :** Immédiat — première session de RDV dans ~3 semaines
- **Resources :** 1 développeur (temps partiel)
- **Technical :** Stack imposée (Next.js, Vercel, Neon), pas de services payants

### Key Assumptions

- Les parents ont accès à un smartphone ou ordinateur avec internet
- L'enseignante peut partager un lien (via pochette, email, ou cahier de liaison)
- Le volume restera faible (20-30 parents, 3-4 sessions/an)
- Pas besoin d'authentification — le contexte école = confiance implicite
- Un seul professeur utilisera l'application (pas de multi-tenant pour le MVP)

---

## Risks & Open Questions

### Key Risks

- **Emails en spam :** Les confirmations/rappels pourraient arriver en spam — mitigation : Gmail a une bonne réputation, demander aux parents de vérifier leurs spams
- **Double réservation (race condition) :** Deux parents cliquent en même temps — mitigation : transaction BDD avec verrouillage
- **Parent sans email :** Ne recevra pas de confirmation/rappel — mitigation : email optionnel, la réservation reste visible pour la prof

### Open Questions

- ~~Quel provider email utiliser ?~~ → **Décidé : Gmail SMTP**
- Format exact du rappel ? (J-1 soir ? Jour J matin ?)
- Faut-il limiter à 1 RDV par parent ? (éviter les doublons par erreur)
- Structure URL : slug personnalisé (`/mme-martin`) ou ID unique ?

### Areas Needing Further Research

- Limites Vercel Cron (fréquence, fiabilité)
- Config Gmail App Password pour SMTP sécurisé

---

## Appendices

### A. Research Summary

**Source principale :** Session de brainstorming avec l'utilisateur final (enseignante via son partenaire développeur).

**Insights clés :**
- Le système actuel des "3 croix" est la source principale de friction
- Les parents veulent du "first come, first served" — pas de négociation
- La prof veut une vue consolidée sans effort d'arbitrage
- La simplicité est plus importante que les fonctionnalités

**Références UX :**
- Calendly et Cal.com comme benchmark d'expérience de réservation fluide

### B. Stakeholder Input

- **Enseignante (utilisatrice principale) :** Veut éliminer l'arbitrage manuel, avoir une vue claire des RDV, recevoir des rappels
- **Parents (utilisateurs secondaires) :** Veulent un process simple et rapide, confirmation immédiate, rappel avant le RDV

### C. References

- Brainstorming session results : `docs/brainstorming-session-results.md`
- Calendly : https://calendly.com
- Cal.com : https://cal.com
- Resend : https://resend.com
- Neon : https://neon.tech
- Vercel : https://vercel.com

---

## Next Steps

### Immediate Actions

1. Valider le choix du provider email (Resend vs alternatives)
2. Définir le schéma de base de données détaillé
3. Créer l'architecture technique (PRD → Architecture doc)
4. Développer la page de réservation parent (feature prioritaire)
5. Implémenter la génération de créneaux
6. Ajouter le système d'emails (confirmation + rappels)

### PM Handoff

Ce Project Brief fournit le contexte complet pour **RDV-École**. L'étape suivante est de passer en mode "PRD Generation" avec le Product Manager pour détailler les user stories et spécifications techniques.

---

*Document généré le 2026-01-07 — BMAD Method*
