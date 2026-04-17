# 🚀 Ultra Code Studio v2.0
### L'Environnement de Développement IA Nouvelle Génération

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-28-purple.svg)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-orange.svg)](https://modelcontextprotocol.io/)

> **Ultra Code Studio** est une plateforme de développement hybride (Web & Desktop) qui fusionne la puissance de **Claude Code**, **GitHub Copilot**, et **Qwen Code** dans une interface ultra-moderne inspirée de *coder.qwen.ai*. Doté du protocole **MCP (Model Context Protocol)** et d'un terminal natif, il redéfinit l'expérience de codage assisté par IA.

---

## 🌟 Pourquoi Ultra Code Studio ?

| Fonctionnalité | Ultra Code Studio | VS Code + Extensions | En ligne (Qwen/Claude) |
| :--- | :---: | :---: | :---: |
| **Mode Hybride** (Web/Desktop) | ✅ Natif | ❌ Desktop uniquement | ❌ Web uniquement |
| **Protocole MCP** | ✅ Complet | ⚠️ Via extensions tierces | ❌ Non supporté |
| **Terminal Natif (PTY)** | ✅ Intégré | ✅ Intégré | ❌ Limité/Simulé |
| **Confidentialité** | 🔒 Local First | 🔒 Local | ☁️ Cloud Only |
| **Multi-Modèles IA** | ✅ OpenAI, Anthropic, Qwen, Local | ⚠️ Config complexe | ❌ Modèle unique |
| **Interface Moderne** | ✅ Design 2024 | ⚠️ Classique | ✅ Moderne |

---

## 🛠️ Architecture Technique

Ultra Code Studio repose sur une architecture modulaire en trois couches :

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Monaco Editor│ │  Chat Panel │ │   File Tree/Tags    │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│         │                │                      │           │
│         └────────────────┼──────────────────────┘           │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   Zustand Store       │                      │
│              │  (State Management)   │                      │
│              └───────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
             │ IPC (Electron)        │ WebSocket (Web)
             ▼                       ▼
┌─────────────────────────┐ ┌─────────────────────────────────┐
│   ELECTRON MAIN PROCESS │ │      BACKEND EXPRESS SERVER     │
│  ┌───────────────────┐  │ │  ┌───────────────────────────┐  │
│  │  node-pty (TTY)   │  │ │  │   Socket.IO Server        │  │
│  │  Native Dialogs   │  │ │  │   REST API Proxy          │  │
│  │  File System API  │  │ │  │   MCP Server Bridge       │  │
│  └───────────────────┘  │ │  └───────────────────────────┘  │
└─────────────────────────┘ └─────────────────────────────────┘
             │                       │
             └───────────┬───────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MODEL CONTEXT PROTOCOL (MCP) SERVER            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │FileSystem│ │  Git Ops │ │  Shell   │ │ Search/Find  │   │
│  │  Tools   │ │  Tools   │ │  Executor│ │   Tools      │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technologique
- **Core** : React 18, TypeScript 5, Vite 5
- **Desktop** : Electron 28, node-pty (Terminal réel)
- **State Management** : Zustand (Rapide & léger)
- **Styling** : TailwindCSS 3 + Shadcn/UI (Composants atomiques)
- **Editor** : Monaco Editor (Le moteur de VS Code)
- **Backend** : Express.js + Socket.IO (Temps réel)
- **IA Protocol** : Model Context Protocol (MCP) SDK

---

## ✨ Fonctionnalités Ultra-Pro

### 1. 🧠 Cerveau IA Multi-Providers
Connectez-vous à n'importe quel modèle de langage :
- **Cloud** : GPT-4o, Claude 3.5 Sonnet, Qwen 2.5 Coder.
- **Local** : Ollama, LM Studio (via API compatible OpenAI).
- **Contexte Intelligent** : L'IA analyse votre arborescence, les fichiers ouverts et le terminal pour des suggestions pertinentes.

### 2. 🔌 MCP Desktop Commander
Implémentation native du **Model Context Protocol**. L'IA peut interagir avec votre machine de manière sécurisée :
- 📂 `read_file` / `write_file` : Manipulation de fichiers.
- 🔍 `search_files` : Recherche sémantique et regex.
- ⚡ `execute_command` : Exécution shell sécurisée.
- 🌳 `list_directory` : Exploration de projet.
- 📊 `git_status` / `git_diff` : Contrôle de version intégré.

### 3. 💻 Terminal Intégré Haute Performance
Oubliez les terminaux web limités. Ultra Code Studio utilise `node-pty` pour un vrai shell :
- Support complet de **Bash**, **Zsh**, **PowerShell**.
- Gestion des signaux (Ctrl+C, Ctrl+Z).
- Couleurs et sorties interactives (htop, vim, ncurses).

### 4. 🎨 Interface "Coder.qwen.ai" Inspired
- **Design Épuré** : Mode sombre profond, typographie optimisée pour le code.
- **Panneaux Redimensionnables** : Ajustez l'espace entre l'éditeur, le chat et le terminal.
- **Sidebar Intelligente** : Arborescence de fichiers avec détection automatique de `.gitignore`.

### 🎯 Interface Professionnelle
- **Design Moderne** - Interface similaire à coder.qwen.ai avec thème sombre/clair
- **Panneaux Redimensionnables** - Éditeur et chat ajustables dynamiquement
- **Sidebar Rétractable** - Navigation flexible dans les fichiers
- **Barre de Statut** - Informations système en temps réel
- **Terminal Intégré** - Exécution de commandes avec historique

### 🤙 Assistant IA Multi-Providers
- **Support Multi-IA** - OpenAI GPT-4, Anthropic Claude, Qwen Coder, modèles locaux
- **Chat Contextuel** - Conversations avec historique complet
- **Analyse de Code** - Revue, débogage, optimisation
- **Génération de Code** - Création de fonctions, composants, tests
- **Suggestions Intelligentes** - Améliorations et bonnes pratiques

### 🔧 Model Context Protocol (MCP)
- **Outils MCP Complets**:
  - Lecture/Écriture de fichiers
  - Navigation dans les répertoires
  - Exécution de commandes shell
  - Recherche de fichiers
  - Opérations Git (status, diff)
  - Métadonnées de fichiers
  
- **Prompts Pré-définis**:
  - Code Review automatique
  - Génération de tests unitaires
  - Documentation de code

### 💻 Électron Desktop App
- **Application Native** - Windows, macOS, Linux
- **Accès Système Complet** - Fichiers, terminal, processus
- **PTY Terminal** - Vrai terminal avec shell interactif
- **Raccourcis Clavier** - Cmd/Ctrl + ` pour terminal, Cmd/Ctrl + B pour sidebar
- **Dialogues Natifs** - Ouverture/enregistrement de fichiers

### 🌐 Mode Web
- **Application Web Progressive** - Fonctionne dans le navigateur
- **Backend Server** - API REST + WebSocket pour terminal
- **Socket.IO** - Communication temps réel
- **API Proxy IA** - Connexion aux providers externes

### 📁 Gestion de Fichiers Avancée
- **Arborescence Interactive** - Navigation hiérarchique
- **Onglets Multiples** - Plusieurs fichiers ouverts simultanément
- **Colorisation Syntaxique** - Support de 50+ langages via Monaco Editor
- **Auto-complétion** - IntelliSense intégré
- **Suivi des Modifications** - Indicateur de fichiers non sauvegardés

### 🛠️ Terminal Intégré
- **Shell Interactif** - Bash, Zsh, PowerShell
- **Historique des Commandes** - Navigation ↑/↓
- **Raccourcis** - Ctrl+C, Ctrl+D, Ctrl+L
- **Sortie Colorisée** - Support ANSI
- **Exécution via API** - Local ou distant

### 📊 Barre de Statut Temps Réel
- **Informations Système** - Plateforme, mémoire, CPU
- **État du Serveur** - Connection web socket
- **Branche Git** - Branche courante du projet
- **Provider IA Actif** - Modèle sélectionné
- **État MCP** - Status du serveur MCP

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** v18+ ou v20+
- **npm** ou **yarn**
- (Optionnel) **Python 3** pour certains outils MCP avancés

### 1. Clonage et Installation

```bash
git clone https://github.com/votre-user/ultra-code-studio.git
cd ultra-code-studio
npm install
```

### 2. Configuration (.env)
Créez un fichier `.env` à la racine :

```ini
# Clés API (Optionnel, peut être défini dans l'UI)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
QWEN_API_KEY=...

# Port du serveur
PORT=3000
VITE_WS_URL=ws://localhost:3000
```

### 3. Modes d'Exécution

#### 🌐 Mode Web (Navigateur)
Idéal pour un accès rapide ou un déploiement serveur distant.
```bash
npm run dev
# Ouvre http://localhost:5173
```

#### 🖥️ Mode Desktop (Application Native)
Recommandé pour une expérience complète avec terminal natif et accès système.
```bash
npm run electron:dev
```

#### 🔧 Mode Serveur Backend (Pour Web)
Si vous utilisez le mode web avec fonctionnalités backend (MCP, Terminal WebSocket) :
```bash
npm run server
```

#### 🔌 Mode Serveur MCP
Pour exécuter le serveur MCP indépendamment :
```bash
npm run mcp:server
```

---

## ⌨️ Raccourcis Clavier

| Action | Windows/Linux | macOS |
| :--- | :--- | :--- |
| **Toggle Terminal** | `Ctrl` + `\`` | `Cmd` + `\`` |
| **Toggle Sidebar** | `Ctrl` + `B` | `Cmd` + `B` |
| **Sauvegarder** | `Ctrl` + `S` | `Cmd` + `S` |
| **Recherche Fichier** | `Ctrl` + `P` | `Cmd` + `P` |
| **Clear Terminal** | `Ctrl` + `L` | `Cmd` + `K` |
| **Fermer Onglet** | `Ctrl` + `W` | `Cmd` + `W` |
| **Historique ↑/↓** | `↑` / `↓` | `↑` / `↓` |
| **Interruption** | `Ctrl` + `C` | `Ctrl` + `C` |

---

## 🔒 Sécurité & Confidentialité

Ultra Code Studio est conçu avec une approche **Local-First** :
1. **Données Locales** : Votre code ne quitte jamais votre machine sauf si vous interrogez explicitement une API IA.
2. **Sandboxing** : Le processus MCP s'exécute avec des permissions restreintes.
3. **Transparence** : Toutes les commandes exécutées par l'IA sont affichées dans le terminal pour validation.
4. **Context Isolation** : Séparation stricte entre renderer et main process (Electron).
5. **IPC Validation** : Validation stricte de tous les messages IPC.

---

## 📊 Performances

- **Vite HMR** - Hot Module Replacement instantané (<50ms)
- **Code Splitting** - Chargement optimisé par route
- **Lazy Loading** - Composants chargés à la demande
- **Memoization** - Optimisation des re-renders React
- **WebSocket Compression** - Messages compressés pour le terminal

---

## 📝 Roadmap

- [ ] Support LLM locaux (Ollama, LM Studio)
- [ ] Extensions marketplace
- [ ] Pair programming en temps réel
- [ ] Debugging intégré
- [ ] Profiling de performances
- [ ] Thèmes personnalisables
- [ ] Plugins communautaires
- [ ] Intégration Docker
- [ ] Support WSL2

---

## 🤝 Contribuer

Nous accueillons les contributions !
1. Fork le projet.
2. Créez une branche (`git checkout -b feature/AmazingFeature`).
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`).
4. Push vers la branche (`git push origin feature/AmazingFeature`).
5. Ouvrez une Pull Request.

---

## 📄 Licence

Distribué sous la licence **MIT**. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 🙏 Remerciements

- **Anthropic** pour l'inspiration Claude Code.
- **Alibaba Cloud** pour l'interface Qwen Coder.
- **Microsoft** pour Monaco Editor.
- La communauté **Model Context Protocol**.
- **Electron** pour le framework desktop.
- **Vite** pour le build tool ultra-rapide.

---

<div align="center">
  <strong>Développé avec ❤️ par Ultra Code Studio Team</strong><br>
  <sub>Le futur du développement assisté par IA est ici.</sub>
</div>
