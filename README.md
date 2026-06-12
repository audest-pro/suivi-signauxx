# 📈 Suivi de Signaux - Plateforme Premium

**Suivi de Signaux** est une application web moderne conçue pour la gestion d'une communauté de trading privée. Elle offre une interface publique d'inscription haut de gamme et un tableau de bord d'administration complet pour gérer les membres et publier des signaux de trading en temps réel.

![Interface Premium](https://img.shields.io/badge/UI-Premium_Dark_Trading-8b5cf6?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-336791?style=for-the-badge&logo=postgresql)

## ✨ Fonctionnalités Principales

### 🌐 Côté Public (Utilisateurs)
*   **Design "Dark Trading" :** Interface immersive sombre avec effets "Glassmorphism", dégradés néon et typographie affirmée.
*   **Inscription Rapide :** Formulaire optimisé sur mobile pour collecter Nom, Prénom, Email et Numéro WhatsApp.
*   **Retour Utilisateur :** Notifications en temps réel en cas de succès ou d'erreur.

### 🛡️ Côté Administrateur (`/admin`)
*   **Dashboard Unifié :** Gestion des inscriptions et des signaux depuis une interface unique sans rechargement de page.
*   **Gestion des Inscriptions (CRUD) :**
    *   Liste complète des membres inscrits.
    *   **Édition en ligne (Inline Editing)** des informations utilisateurs.
    *   **Extracteur de Données :** Boutons de copie rapide pour extraire instantanément tous les numéros WhatsApp ou adresses email en 1 clic.
*   **Gestion des Signaux de Trading (CRUD) :**
    *   Publication rapide de nouveaux signaux (Paire, Achat/Vente, Prix d'entrée, Take Profit, Stop Loss).
    *   Modification et suppression des signaux existants.
    *   Basculement du statut (Actif / Clôturé).
*   **Optimisation Mobile "Zéro Scroll" :** L'interface admin est condensée pour être 100% utilisable d'une seule main sur smartphone.

### 🔒 Sécurité & Performance
*   **Verrouillage des Routes :** Toutes les Server Actions sont protégées par une vérification de session stricte.
*   **Anti-Injection SQL :** Utilisation de requêtes paramétrées via Neon DB.
*   **Validation Stricte :** Les entrées utilisateurs sont nettoyées, typées et soumises à des restrictions de longueur et de format côté serveur.
*   **Anti-Spam :** Rate-limiting basique empêchant la soumission multiple depuis la même adresse email dans un délai court.

## 🛠️ Stack Technique

*   **Framework :** Next.js (App Router, Server Actions)
*   **Langage :** TypeScript
*   **Styling :** Tailwind CSS v4 (avec utilisation avancée de l'espace couleur `oklch`)
*   **Base de données :** PostgreSQL (hébergé sur Neon Database)
*   **Composants UI :** shadcn/ui & Lucide Icons
*   **Notifications :** Sonner

## 🚀 Installation & Déploiement

### Prérequis
*   Node.js 18+
*   Une base de données PostgreSQL (ex: Neon, Supabase)
*   Le gestionnaire de paquets `pnpm` (recommandé) ou `npm`

### Configuration locale

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/audest-pro/suivi-signauxx.git
   cd suivi-signauxx
   ```

2. **Installer les dépendances :**
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement :**
   Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés :
   ```env
   # URL de connexion à votre base de données PostgreSQL
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   
   # Mot de passe pour accéder à la zone /admin
   ADMIN_PASSWORD="votre_mot_de_passe_ultra_securise"
   ```

4. **Lancer le serveur de développement :**
   ```bash
   pnpm dev
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).
   L'espace admin est discrètement accessible via [http://localhost:3000/admin](http://localhost:3000/admin).

## 💡 Notes de Design (CSS)
Le projet utilise des variables CSS modernes pour garantir une identité visuelle forte. La racine (`:root`) force un thème sombre profond (`oklch(0.11 0.01 250)`). Les effets de transparence sont gérés via la classe utilitaire `.glass-card`.
