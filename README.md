# 🚀 Ultra Code Studio v2.0

**Ultra Professional AI-Powered IDE - Web & Desktop avec support MCP**

Une application de développement ultra-professionnelle inspirée de coder.qwen.ai, Claude Code, et GitHub Copilot, avec des fonctionnalités avancées pour le développement moderne.

## ✨ Fonctionnalités Principales

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

## 🏗️ Architecture Technique

### Frontend
- **React 18** - Framework UI moderne
- **TypeScript** - Typage statique complet
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling utilitaire
- **Zustand** - State management léger
- **Monaco Editor** - Moteur d'édition VS Code
- **Lucide Icons** - Icônes modernes
- **Socket.IO Client** - Communication WebSocket

### Backend (Optionnel pour web)
- **Express.js** - Serveur HTTP
- **Socket.IO** - WebSocket server
- **Node-PTY** - Terminal pseudo-TTY
- **CORS** - Partage de ressources

### Desktop (Electron)
- **Electron 28** - Framework desktop cross-platform
- **IPC Bridge** - Communication secure renderer-main
- **Context Isolation** - Sécurité renforcée
- **Native Dialogs** - Fenêtres natives OS

### MCP Server
- **@modelcontextprotocol/sdk** - SDK officiel MCP
- **Outils Personnalisés** - File system, git, shell
- **Resources** - Accès aux fichiers via URI
- **Prompts** - Templates de conversation

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- 500MB d'espace disque minimum

### Installation des dépendances

```bash
cd /workspace
npm install
```

### Modes d'exécution

#### 1. Mode Web (Navigateur)
```bash
# Démarrer le frontend uniquement
npm run dev

# Dans un autre terminal, démarrer le backend (optionnel)
npm run server
```

Accédez à `http://localhost:5173`

#### 2. Mode Desktop (Electron)
```bash
# Démarrer en mode développement
npm run electron:dev

# Build pour production
npm run electron:build
```

#### 3. Serveur MCP
```bash
# Démarrer le serveur MCP
npm run mcp:server
```

## 🎮 Utilisation

### Raccourcis Clavier
| Touche | Action |
|--------|--------|
| `Ctrl/Cmd + \`` | Toggle Terminal |
| `Ctrl/Cmd + B` | Toggle Sidebar |
| `Ctrl/Cmd + S` | Sauvegarder fichier |
| `Ctrl/Cmd + W` | Fermer onglet |
| `↑/↓` | Historique terminal |
| `Ctrl+C` | Interruption commande |
| `Ctrl+L` | Clear terminal |

### Configuration IA

Ajoutez vos clés API dans les paramètres :

```typescript
// Dans l'interface de configuration
{
  provider: 'openai', // ou 'anthropic', 'qwen', 'local'
  apiKey: 'votre-clé-api',
  model: 'gpt-4-turbo'
}
```

### Configuration MCP

Le serveur MCP expose ces outils :
- `read_file` - Lire un fichier
- `write_file` - Écrire un fichier
- `list_directory` - Lister un répertoire
- `execute_command` - Exécuter une commande
- `search_files` - Rechercher des fichiers
- `get_file_info` - Infos fichier
- `create_directory` - Créer dossier
- `delete_path` - Supprimer
- `git_status` - Status git
- `git_diff` - Diff git

## 📁 Structure du Projet

```
/workspace
├── src/                    # Code source React
│   ├── components/         # Composants UI
│   │   ├── ChatPanel.tsx   # Panel de chat IA
│   │   ├── CodeEditor.tsx  # Éditeur Monaco
│   │   ├── FileTree.tsx    # Arborescence fichiers
│   │   ├── Sidebar.tsx     # Barre latérale
│   │   ├── TerminalPanel.tsx  # Terminal
│   │   ├── StatusBar.tsx   # Barre de statut
│   │   └── ui/             # Composants de base
│   ├── store/              # Zustand store
│   ├── services/           # Services API
│   ├── hooks/              # Hooks personnalisés
│   └── types/              # Types TypeScript
├── electron/               # Code Electron
│   ├── main.ts             # Processus principal
│   └── preload.ts          # Script de préchargement
├── server/                 # Backend web
│   └── index.ts            # Serveur Express + Socket.IO
├── mcp/                    # Serveur MCP
│   └── server.ts           # Outils et resources MCP
├── public/                 # Assets statiques
└── package.json            # Dépendances et scripts
```

## 🔒 Sécurité

- **Context Isolation** - Séparation stricte renderer-main
- **IPC Validation** - Validation des messages IPC
- **CORS Configurable** - Protection des APIs
- **API Keys Sécurisées** - Stockage local chiffré (à implémenter)

## 🚀 Performances

- **Vite HMR** - Hot Module Replacement instantané
- **Code Splitting** - Chargement optimisé
- **Lazy Loading** - Composants chargés à la demande
- **Memoization** - Optimisation des re-renders

## 📝 Roadmap

- [ ] Support LLM locaux (Ollama, LM Studio)
- [ ] Extensions marketplace
- [ ] Pair programming en temps réel
- [ ] Debugging intégré
- [ ] Profiling de performances
- [ ] Thèmes personnalisables
- [ ] Plugins communautaires

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez lire notre guide de contribution avant de soumettre une PR.

## 📄 License

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Electron](https://www.electronjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Développé avec ❤️ par Ultra Code Studio Team**
