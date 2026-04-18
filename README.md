# 🚀 Ultra Code Studio v2.0

<div align="center">

### L'Environnement de Développement IA Nouvelle Génération

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-28-purple.svg)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-brightgreen.svg)](https://vitejs.dev/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-orange.svg)](https://modelcontextprotocol.io/)

**Une plateforme de développement hybride (Web & Desktop) qui fusionne la puissance de Claude Code, GitHub Copilot et Qwen Code dans une interface ultra-moderne.**

[Installation Rapide](#-installation-rapide) • [Fonctionnalités](#-fonctionnalités-principales) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contribuer](#-contribuer)

</div>

---

## 📖 Table des Matières

<details>
<summary>Cliquez pour développer le sommaire complet</summary>

1. [Vue d'ensemble](#-vue-densemble)
2. [Comparaison](#-comparaison-avec-les-outils-existants)
3. [Fonctionnalités Principales](#-fonctionnalités-principales)
   - [IA Multi-Providers](#-cerveau-ia-multi-providers)
   - [Protocole MCP](#-mcp-desktop-commander)
   - [Terminal Natif](#-terminal-intégré-haute-performance)
   - [Importation de Fichiers](#-importation-de-fichiers-et-documents)
4. [Architecture Technique](#-architecture)
5. [Stack Technologique](#-stack-technologique)
6. [Installation Rapide](#-installation-rapide)
7. [Modes d'Exécution](#-modes-dexécution)
8. [Configuration](#-configuration)
9. [Raccourcis Clavier](#-raccourcis-clavier)
10. [Sécurité](#-sécurité--confidentialité)
11. [Performances](#-performances)
12. [Roadmap](#-roadmap)
13. [Contribuer](#-contribuer)
14. [Licence](#-licence)
15. [Remerciements](#-remerciements)

</details>

---

## 🌟 Vue d'ensemble

**Ultra Code Studio** redéfinit l'expérience de codage assisté par IA en combinant :

- 🧠 **Intelligence Artificielle** : Connectez-vous à GPT-4o, Claude 3.5, Qwen 2.5 ou vos modèles locaux
- 🔌 **Protocole MCP** : Interaction sécurisée avec votre système de fichiers et shell
- 💻 **Terminal Réel** : Vrai PTY avec support Bash, Zsh, PowerShell
- 🎨 **Interface Moderne** : Design inspiré de coder.qwen.ai avec thème sombre/clair
- 📁 **Gestion Avancée** : Éditeur Monaco, arborescence interactive, onglets multiples
- 🖼️ **Importation de Fichiers** : Attachez images, PDF, documents et fichiers de code directement au chat

---

## 📊 Comparaison avec les Outils Existants

| Fonctionnalité | **Ultra Code Studio** | VS Code + Extensions | En ligne (Qwen/Claude) |
| :--- | :---: | :---: | :---: |
| **Mode Hybride** (Web/Desktop) | ✅ Natif | ❌ Desktop uniquement | ❌ Web uniquement |
| **Protocole MCP** | ✅ Complet | ⚠️ Via extensions tierces | ❌ Non supporté |
| **Terminal Natif (PTY)** | ✅ Intégré | ✅ Intégré | ❌ Limité/Simulé |
| **Importation Fichiers Chat** | ✅ Images, PDF, Docs | ❌ Non disponible | ⚠️ Limité |
| **Confidentialité** | 🔒 Local First | 🔒 Local | ☁️ Cloud Only |
| **Multi-Modèles IA** | ✅ OpenAI, Anthropic, Qwen, Local | ⚠️ Config complexe | ❌ Modèle unique |
| **Interface Moderne** | ✅ Design 2024 | ⚠️ Classique | ✅ Moderne |
| **Open Source** | ✅ MIT | ⚠️ Partiel | ❌ Propriétaire |

---

## ✨ Fonctionnalités Principales

### 🧠 Cerveau IA Multi-Providers

Connectez-vous à n'importe quel modèle de langage selon vos besoins :

| Type | Providers Supportés | Cas d'Usage |
| :--- | :--- | :--- |
| **Cloud** | GPT-4o, Claude 3.5 Sonnet, Qwen 2.5 Coder | Tâches complexes, raisonnement avancé |
| **Local** | Ollama, LM Studio (API OpenAI-compatible) | Confidentialité maximale, hors-ligne |
| **Spécialisé** | Modèles de codage dédiés | Génération, refactoring, debugging |

**Fonctionnalités IA :**
- 📝 **Chat Contextuel** : Conversations avec historique complet et contexte du projet
- 🔍 **Analyse de Code** : Revue, débogage, optimisation automatique
- ⚡ **Génération de Code** : Création de fonctions, composants, tests unitaires
- 💡 **Suggestions Intelligentes** : Améliorations et bonnes pratiques en temps réel

---

### 🔌 MCP Desktop Commander

Implémentation native du **Model Context Protocol** pour une interaction sécurisée avec votre machine :

| Outil | Description | Exemple d'Usage |
| :--- | :--- | :--- |
| `read_file` / `write_file` | Manipulation de fichiers | Lire un config, écrire un module |
| `search_files` | Recherche sémantique et regex | Trouver des occurrences de code |
| `execute_command` | Exécution shell sécurisée | Lancer des tests, builds |
| `list_directory` | Exploration de projet | Naviguer dans l'arborescence |
| `git_status` / `git_diff` | Contrôle de version intégré | Voir les modifications en cours |
| `file_metadata` | Métadonnées de fichiers | Taille, date, permissions |

**Prompts Pré-définis :**
- 📋 **Code Review** : Analyse automatique de votre code
- 🧪 **Génération de Tests** : Crée des tests unitaires pertinents
- 📚 **Documentation** : Génère la documentation de vos fonctions

---

### 💻 Terminal Intégré Haute Performance

Oubliez les terminaux web limités. Ultra Code Studio utilise `node-pty` pour un vrai shell :

- ✅ **Support Complet** : Bash, Zsh, PowerShell selon votre OS
- ✅ **Signaux Unix** : Ctrl+C, Ctrl+Z, Ctrl+D fonctionnels
- ✅ **Sorties Interactives** : htop, vim, ncurses, tmux
- ✅ **Couleurs ANSI** : Tous les codes couleur supportés
- ✅ **Historique** : Navigation ↑/↓ dans les commandes

---

### 📎 Importation de Fichiers et Documents

Attachez facilement des fichiers à vos conversations IA pour une analyse contextuelle enrichie :

**Types de Fichiers Supportés :**

| Catégorie | Extensions | Prévisualisation |
| :--- | :--- | :---: |
| **Images** | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` | ✅ Aperçu visuel |
| **Documents** | `.pdf`, `.docx`, `.txt`, `.md` | ✅ Contenu texte |
| **Code** | `.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`, `.go`, `.rs`, `.c`, `.cpp` | ✅ Syntaxe colorée |
| **Config** | `.json`, `.yaml`, `.yml`, `.xml`, `.toml` | ✅ Structure arborescente |
| **Styles** | `.css`, `.scss`, `.less`, `.sass` | ✅ Syntaxe colorée |
| **Web** | `.html`, `.htm`, `.vue`, `.svelte` | ✅ Syntaxe colorée |

**Fonctionnalités :**
- 📤 **Drag & Drop** : Glissez-déposez vos fichiers directement dans le chat
- 🖼️ **Aperçu Avant Envoi** : Visualisez les images et documents avant de les envoyer
- 🗑️ **Suppression Facile** : Retirez les pièces jointes avant envoi
- 📊 **Taille Affichée** : Formatage automatique de la taille des fichiers
- 🔄 **Multi-Fichiers** : Attachez plusieurs fichiers simultanément
- ⚡ **Compression** : Optimisation automatique pour les images volumineuses

---

### 🎨 Interface Professionnelle

- **Design Moderne** : Interface similaire à coder.qwen.ai avec thème sombre/clair
- **Panneaux Redimensionnables** : Éditeur et chat ajustables dynamiquement
- **Sidebar Rétractable** : Navigation flexible dans les fichiers
- **Barre de Statut** : Informations système en temps réel (mémoire, CPU, Git)
- **Onglets Multiples** : Plusieurs fichiers ouverts simultanément
- **Indicateurs de Modification** : Suivi des fichiers non sauvegardés

---

### 🖥️ Application Desktop Native

- **Multi-Plateforme** : Windows, macOS, Linux
- **Accès Système Complet** : Fichiers, terminal, processus natifs
- **Dialogues Natifs** : Ouverture/enregistrement de fichiers système
- **Raccourcis Globaux** : Cmd/Ctrl + ` pour terminal, Cmd/Ctrl + B pour sidebar
- **Mode Hors-Ligne** : Fonctionne sans connexion Internet (modèles locaux)

---

### 🌐 Mode Web Progressif

- **Navigateur** : Fonctionne dans Chrome, Firefox, Safari, Edge
- **Backend Server** : API REST + WebSocket pour le terminal
- **Socket.IO** : Communication temps réel bidirectionnelle
- **API Proxy IA** : Connexion sécurisée aux providers externes
- **PWA Ready** : Installation possible comme application web

---

## 🏗️ Architecture

Ultra Code Studio repose sur une architecture modulaire en trois couches :

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + TypeScript)             │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐   │
│  │ Monaco Editor│ │  Chat Panel  │ │   File Tree / Tags     │   │
│  │              │ │  + Attachments│ │                        │   │
│  └──────────────┘ └──────────────┘ └────────────────────────┘   │
│         │                │                      │                │
│         └────────────────┼──────────────────────┘                │
│                          ▼                                       │
│              ┌─────────────────────────┐                         │
│              │   Zustand Store         │                         │
│              │   (State Management)    │                         │
│              └─────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
               │ IPC (Electron)           │ WebSocket (Web)
               ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────────────┐
│  ELECTRON MAIN PROCESS   │   │     BACKEND EXPRESS SERVER       │
│  ┌────────────────────┐  │   │   ┌──────────────────────────┐   │
│  │   node-pty (TTY)   │  │   │   │   Socket.IO Server       │   │
│  │   Native Dialogs   │  │   │   │   REST API Proxy         │   │
│  │   File System API  │  │   │   │   MCP Server Bridge      │   │
│  └────────────────────┘  │   │   └──────────────────────────┘   │
└──────────────────────────┘   └──────────────────────────────────┘
               │                          │
               └───────────┬──────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              MODEL CONTEXT PROTOCOL (MCP) SERVER                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ FileSystem │ │  Git Ops   │ │   Shell    │ │ Search/Find  │  │
│  │   Tools    │ │   Tools    │ │  Executor  │ │   Tools      │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Technologique

| Couche | Technologies | Version |
| :--- | :--- | :---: |
| **Core Frontend** | React, TypeScript | 18.2 / 5.3 |
| **Build Tool** | Vite | 5.0 |
| **Desktop Framework** | Electron | 28 |
| **State Management** | Zustand | 4.x |
| **Styling** | TailwindCSS, Shadcn/UI | 3.x |
| **Editor** | Monaco Editor | Latest |
| **Backend** | Express.js, Socket.IO | 4.x / 4.x |
| **Terminal** | node-pty | Latest |
| **IA Protocol** | Model Context Protocol SDK | Latest |
| **Icons** | Lucide React | Latest |

---

## 🚀 Installation Rapide

### Prérequis

- **Node.js** : v18+ ou v20+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** : Pour cloner le dépôt
- *(Optionnel)* **Python 3** : Pour certains outils MCP avancés

### Étapes d'Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-user/ultra-code-studio.git

# 2. Se déplacer dans le répertoire
cd ultra-code-studio

# 3. Installer les dépendances
npm install

# 4. Créer le fichier de configuration
cp .env.example .env
```

---

## ⚙️ Modes d'Exécution

### 🌐 Mode Web (Navigateur)

Idéal pour un accès rapide ou un déploiement serveur distant.

```bash
npm run dev
# ➜  Local:   http://localhost:5173/
```

### 🖥️ Mode Desktop (Application Native)

Recommandé pour une expérience complète avec terminal natif et accès système.

```bash
npm run electron:dev
# Lance l'application desktop avec hot-reload
```

### 🔧 Mode Serveur Backend

Nécessaire pour le mode web avec fonctionnalités complètes (MCP, Terminal WebSocket).

```bash
npm run server
# Démarre le serveur Express + Socket.IO sur le port 3000
```

### 🔌 Mode Serveur MCP

Pour exécuter le serveur MCP indépendamment.

```bash
npm run mcp:server
# Démarre le serveur MCP pour les outils système
```

### 📦 Build de Production

```bash
# Build Web
npm run build

# Build Desktop (Windows, macOS, Linux)
npm run electron:build
```

---

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet :

```ini
# ===========================================
# CLÉS API (Optionnel - peut être défini dans l'UI)
# ===========================================
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
QWEN_API_KEY=...
OLLAMA_BASE_URL=http://localhost:11434

# ===========================================
# CONFIGURATION SERVEUR
# ===========================================
PORT=3000
VITE_WS_URL=ws://localhost:3000
VITE_API_URL=http://localhost:3000

# ===========================================
# OPTIONS AVANCÉES
# ===========================================
NODE_ENV=development
DEBUG=mcp:*
```

---

## ⌨️ Raccourcis Clavier

| Action | Windows/Linux | macOS |
| :--- | :--- | :--- |
| **Toggle Terminal** | `Ctrl` + `` ` `` | `Cmd` + `` ` `` |
| **Toggle Sidebar** | `Ctrl` + `B` | `Cmd` + `B` |
| **Sauvegarder** | `Ctrl` + `S` | `Cmd` + `S` |
| **Recherche Fichier** | `Ctrl` + `P` | `Cmd` + `P` |
| **Clear Terminal** | `Ctrl` + `L` | `Cmd` + `K` |
| **Fermer Onglet** | `Ctrl` + `W` | `Cmd` + `W` |
| **Historique ↑/↓** | `↑` / `↓` | `↑` / `↓` |
| **Interruption** | `Ctrl` + `C` | `Ctrl` + `C` |
| **Attacher Fichier** | `Ctrl` + `Shift` + `A` | `Cmd` + `Shift` + `A` |

---

## 🔒 Sécurité & Confidentialité

Ultra Code Studio est conçu avec une approche **Local-First** :

1. **📍 Données Locales** : Votre code ne quitte jamais votre machine sauf si vous interrogez explicitement une API IA
2. **🔒 Sandboxing** : Le processus MCP s'exécute avec des permissions restreintes
3. **👁️ Transparence** : Toutes les commandes exécutées par l'IA sont affichées dans le terminal pour validation
4. **🧩 Context Isolation** : Séparation stricte entre renderer et main process (Electron)
5. **✅ IPC Validation** : Validation stricte de tous les messages IPC
6. **🛡️ Content Security Policy** : Protection contre les injections XSS

---

## 📊 Performances

| Métrique | Valeur | Détails |
| :--- | :---: | :--- |
| **HMR (Hot Reload)** | < 50ms | Grâce à Vite |
| **Code Splitting** | Actif | Chargement par route |
| **Lazy Loading** | Actif | Composants à la demande |
| **Memoization** | Optimisé | Réduction des re-renders |
| **WebSocket** | Compressé | Messages terminal optimisés |
| **Bundle Size** | ~2MB | Gzip compressé |

---

## 📅 Roadmap

### ✅ Version 2.0 (Actuelle)
- [x] Interface moderne style Qwen Coder
- [x] Protocole MCP complet
- [x] Terminal natif PTY
- [x] Multi-providers IA
- [x] Importation de fichiers (images, documents)

### 🔜 Version 2.1 (Q1 2025)
- [ ] Support LLM locaux (Ollama, LM Studio)
- [ ] Thèmes personnalisables
- [ ] Extensions marketplace
- [ ] Pair programming en temps réel

### 🚀 Version 2.2 (Q2 2025)
- [ ] Debugging intégré
- [ ] Profiling de performances
- [ ] Plugins communautaires
- [ ] Intégration Docker

### 🎯 Version 3.0 (H2 2025)
- [ ] Support WSL2
- [ ] IA embarquée (modèles quantifiés)
- [ ] Collaboration multi-utilisateurs
- [ ] Marketplace de prompts

---

## 🤝 Contribuer

Nous accueillons les contributions de la communauté !

### Comment Contribuer

1. **Fork** le projet
2. **Clone** votre fork (`git clone https://github.com/votre-user/ultra-code-studio.git`)
3. **Branche** de fonctionnalité (`git checkout -b feature/AmazingFeature`)
4. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
5. **Push** vers la branche (`git push origin feature/AmazingFeature`)
6. **Pull Request** sur le dépôt principal

### Guidelines de Développement

- Respectez les conventions ESLint/Prettier
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les changements dans le README
- Utilisez des commits conventionnels (Conventional Commits)

### Besoin d'Aide ?

- 📖 Consultez la [Documentation](./docs/)
- 💬 Rejoignez les [Discussions GitHub](../../discussions)
- 🐛 Signalez les bugs via les [Issues](../../issues)

---

## 📄 Licence

Distribué sous la licence **MIT**. Voir [LICENSE](LICENSE) pour plus d'informations.

```
Copyright (c) 2024 Ultra Code Studio Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Remerciements

- **[Anthropic](https://anthropic.com/)** pour l'inspiration Claude Code
- **[Alibaba Cloud](https://www.alibabacloud.com/)** pour l'interface Qwen Coder
- **[Microsoft](https://microsoft.com/)** pour Monaco Editor
- **[Model Context Protocol](https://modelcontextprotocol.io/)** Community
- **[Electron](https://www.electronjs.org/)** Team
- **[Vite](https://vitejs.dev/)** Team
- Tous les contributeurs open-source

---

<div align="center">

### 🌟 Ultra Code Studio Team

**Développé avec ❤️ pour la communauté des développeurs**

*Le futur du développement assisté par IA est ici.*

[📧 Contact](mailto:contact@ultracodestudio.dev) • [🌐 Site Web](https://ultracodestudio.dev) • [🐦 Twitter](https://twitter.com/ultracodestudio)

---

⭐ **Si vous aimez ce projet, donnez-nous une étoile !** ⭐

</div>
