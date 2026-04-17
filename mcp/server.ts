import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Create MCP Server
const server = new McpServer({
  name: 'ultra-code-studio',
  version: '2.0.0',
})

// Tool: Read File
server.tool(
  'read_file',
  'Read the contents of a file',
  {
    filePath: z.string().describe('The path to the file to read'),
  },
  async ({ filePath }) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return {
        content: [{ type: 'text', text: content }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error reading file: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Write File
server.tool(
  'write_file',
  'Write content to a file',
  {
    filePath: z.string().describe('The path to the file to write'),
    content: z.string().describe('The content to write to the file'),
  },
  async ({ filePath, content }) => {
    try {
      await fs.writeFile(filePath, content, 'utf-8')
      return {
        content: [{ type: 'text', text: `Successfully wrote to ${filePath}` }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error writing file: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: List Directory
server.tool(
  'list_directory',
  'List contents of a directory',
  {
    dirPath: z.string().describe('The path to the directory to list'),
  },
  async ({ dirPath }) => {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      const result = items.map(item => ({
        name: item.name,
        isDirectory: item.isDirectory(),
      }))
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error listing directory: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Execute Command
server.tool(
  'execute_command',
  'Execute a shell command',
  {
    command: z.string().describe('The command to execute'),
    cwd: z.string().optional().describe('Working directory for the command'),
  },
  async ({ command, cwd }) => {
    try {
      const { stdout, stderr } = await execAsync(command, { 
        cwd: cwd || process.cwd(),
        maxBuffer: 1024 * 1024 * 10,
      })
      return {
        content: [{ 
          type: 'text', 
          text: stdout ? `Output:\n${stdout}` : stderr ? `Error Output:\n${stderr}` : 'Command executed successfully' 
        }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error executing command: ${error.message}\n${error.stderr || ''}` }],
        isError: true,
      }
    }
  }
)

// Tool: Search Files
server.tool(
  'search_files',
  'Search for files matching a pattern',
  {
    pattern: z.string().describe('The search pattern (glob)'),
    dirPath: z.string().describe('The directory to search in'),
  },
  async ({ pattern, dirPath }) => {
    try {
      const { globby } = await import('globby')
      const files = await globby(pattern, { cwd: dirPath })
      return {
        content: [{ type: 'text', text: JSON.stringify(files, null, 2) }],
      }
    } catch (error: any) {
      // Fallback without globby
      const items = await fs.readdir(dirPath, { recursive: true })
      const filtered = items.filter(item => item.includes(pattern))
      return {
        content: [{ type: 'text', text: JSON.stringify(filtered.slice(0, 100), null, 2) }],
      }
    }
  }
)

// Tool: Get File Info
server.tool(
  'get_file_info',
  'Get metadata about a file',
  {
    filePath: z.string().describe('The path to the file'),
  },
  async ({ filePath }) => {
    try {
      const stats = await fs.stat(filePath)
      return {
        content: [{ 
          type: 'text', 
          text: JSON.stringify({
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            accessed: stats.atime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
          }, null, 2) 
        }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error getting file info: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Create Directory
server.tool(
  'create_directory',
  'Create a new directory',
  {
    dirPath: z.string().describe('The path to the directory to create'),
  },
  async ({ dirPath }) => {
    try {
      await fs.mkdir(dirPath, { recursive: true })
      return {
        content: [{ type: 'text', text: `Successfully created directory: ${dirPath}` }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error creating directory: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Delete File/Directory
server.tool(
  'delete_path',
  'Delete a file or directory',
  {
    pathToDelete: z.string().describe('The path to delete'),
  },
  async ({ pathToDelete }) => {
    try {
      const stats = await fs.stat(pathToDelete)
      if (stats.isDirectory()) {
        await fs.rm(pathToDelete, { recursive: true, force: true })
      } else {
        await fs.unlink(pathToDelete)
      }
      return {
        content: [{ type: 'text', text: `Successfully deleted: ${pathToDelete}` }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error deleting path: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Git Operations
server.tool(
  'git_status',
  'Get git repository status',
  {
    repoPath: z.string().optional().describe('Path to git repository'),
  },
  async ({ repoPath }) => {
    try {
      const { stdout } = await execAsync('git status --porcelain', { 
        cwd: repoPath || process.cwd() 
      })
      return {
        content: [{ type: 'text', text: stdout || 'Working tree clean' }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Not a git repository or error: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Tool: Git Diff
server.tool(
  'git_diff',
  'Show git diff',
  {
    repoPath: z.string().optional().describe('Path to git repository'),
    file: z.string().optional().describe('Specific file to diff'),
  },
  async ({ repoPath, file }) => {
    try {
      const { stdout } = await execAsync(
        file ? `git diff ${file}` : 'git diff',
        { cwd: repoPath || process.cwd() }
      )
      return {
        content: [{ type: 'text', text: stdout || 'No changes' }],
      }
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `Error getting diff: ${error.message}` }],
        isError: true,
      }
    }
  }
)

// Resource: File Content
server.resource(
  'file',
  'file://{filePath}',
  async (uri) => {
    const filePath = uri.pathname.replace(/^\//, '')
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return {
        contents: [{
          uri: uri.toString(),
          mimeType: 'text/plain',
          text: content,
        }],
      }
    } catch (error: any) {
      return {
        contents: [],
        isError: true,
      }
    }
  }
)

// Prompt: Code Review
server.prompt(
  'code_review',
  'Review code for best practices and potential issues',
  {
    code: z.string().describe('The code to review'),
    language: z.string().optional().describe('Programming language'),
  },
  ({ code, language }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Please review this ${language || ''} code for best practices, potential bugs, performance issues, and security concerns:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``,
      },
    }],
  })
)

// Prompt: Generate Tests
server.prompt(
  'generate_tests',
  'Generate unit tests for code',
  {
    code: z.string().describe('The code to test'),
    framework: z.string().optional().describe('Testing framework (jest, vitest, etc.)'),
  },
  ({ code, framework }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Generate comprehensive unit tests for this code using ${framework || 'a modern testing framework'}:\n\n\`\`\`\n${code}\n\`\`\``,
      },
    }],
  })
)

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
