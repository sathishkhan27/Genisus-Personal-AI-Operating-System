import { defineConfig } from 'vite';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  plugins: [
    {
      name: 'genisus-telemetry-and-dev-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Cloud Telemetry endpoint
          if (req.url.startsWith('/api/cloud-telemetry')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const cloudData = {
              provider: 'Neon Cloud Serverless PostgreSQL',
              region: 'aws-us-east-2',
              timestamp: new Date().toISOString(),
              projects: [
                {
                  id: 'floral-rain-10542505',
                  name: 'pingzo-db',
                  platform: 'aws',
                  region: 'aws-us-east-2',
                  pgVersion: 18,
                  status: 'ONLINE',
                  computeStatus: 'active',
                  storageSize: '32.68 MB',
                  tablesCount: 13,
                  totalOrders: 12,
                  tables: ['supermarket_orders', 'delivery_partners', 'customers', 'products', 'payments'],
                  lastActive: '2026-09-12T05:38:29Z',
                  health: '100% Operational'
                },
                {
                  id: 'ancient-salad-90576759',
                  name: 'booknowgo',
                  platform: 'aws',
                  region: 'aws-us-east-2',
                  pgVersion: 18,
                  status: 'STANDBY',
                  computeStatus: 'idle',
                  storageSize: '33.12 MB',
                  tablesCount: 20,
                  tables: ['bookings', 'hotels', 'payments', 'rooms', 'booking_guests'],
                  lastActive: '2026-09-11T13:54:20Z',
                  health: '100% Operational'
                }
              ]
            };

            res.end(JSON.stringify(cloudData));
            return;
          }

          // -------------------------------------------------------------
          // REAL-TIME GIT & IDE BRIDGE API
          // -------------------------------------------------------------

          // Helper to parse JSON body
          const parseBody = () => new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(JSON.parse(body || '{}'));
              } catch {
                resolve({});
              }
            });
          });

          // 1. Discover Real Local Projects
          if (req.url.startsWith('/api/dev/real-projects')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const candidatePaths = [
              { id: 'genisus-os', name: 'GENISUS AI Operating System', path: '/Users/sathish.s/Documents/genisus', type: 'Vite / JavaScript' },
              { id: 'shreeja_ulagam', name: 'Shreeja Ulagam App', path: '/Users/sathish.s/Documents/sreejaulagam/shreeja_ulagam', type: 'Flutter / Dart' },
              { id: 'booknowgo-frontend', name: 'BookNowGo Frontend', path: '/Users/sathish.s/Documents/booknowgo-frontend', type: 'React / Next.js' },
              { id: 'booknowgo-backend', name: 'BookNowGo Backend', path: '/Users/sathish.s/Documents/booknowgo-backend', type: 'Node.js / Express' },
              { id: 'pingzo-seller-portal', name: 'PingZO Seller Portal', path: '/Users/sathish.s/Documents/pingzo-seller-portal', type: 'Web Application' },
              { id: 'flutter_ecommerce_app', name: 'PingZO Customer E-Commerce', path: '/Users/sathish.s/Documents/flutter_ecommerce_app', type: 'Flutter / Dart' },
              { id: 'native_webview', name: 'Native WebView Utility', path: '/Users/sathish.s/Documents/GitHub/native_webview', type: 'Kotlin / Android' }
            ];

            const realProjects = await Promise.all(candidatePaths.map(async (p) => {
              const exists = fs.existsSync(p.path);
              if (!exists) return null;

              let isGit = false;
              let branch = 'main';
              let dirtyFiles = 0;
              let remote = '';
              let lastCommit = null;

              if (fs.existsSync(path.join(p.path, '.git'))) {
                isGit = true;
                try {
                  const { stdout: branchOut } = await execAsync(`git -C "${p.path}" branch --show-current`);
                  branch = branchOut.trim() || 'main';

                  const { stdout: statusOut } = await execAsync(`git -C "${p.path}" status --porcelain`);
                  dirtyFiles = statusOut.trim() ? statusOut.trim().split('\n').length : 0;

                  const { stdout: remoteOut } = await execAsync(`git -C "${p.path}" remote -v`);
                  const remoteMatch = remoteOut.match(/origin\s+([^\s]+)\s+\(push\)/);
                  remote = remoteMatch ? remoteMatch[1] : '';

                  const { stdout: logOut } = await execAsync(`git -C "${p.path}" log -1 --format="%h|%s|%an|%ar"`);
                  if (logOut.trim()) {
                    const [sha, msg, author, relDate] = logOut.trim().split('|');
                    lastCommit = { sha, message: msg, author, date: relDate };
                  }
                } catch (e) {
                  // Fallback if git query fails
                }
              }

              return {
                ...p,
                isGit,
                branch,
                dirtyFiles,
                remote,
                lastCommit
              };
            }));

            res.end(JSON.stringify(realProjects.filter(Boolean)));
            return;
          }

          // 2. Real Git Status
          if (req.url.startsWith('/api/dev/git-status')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const url = new URL(req.url, 'http://localhost:5173');
            const targetPath = url.searchParams.get('project') || '/Users/sathish.s/Documents/genisus';

            try {
              const { stdout: branchOut } = await execAsync(`git -C "${targetPath}" branch --show-current`);
              const branch = branchOut.trim() || 'main';

              const { stdout: statusOut } = await execAsync(`git -C "${targetPath}" status --porcelain=v1 -b`);
              const lines = statusOut.trim().split('\n').filter(Boolean);

              const files = [];
              for (const line of lines) {
                if (line.startsWith('##')) continue;
                const status = line.substring(0, 2).trim();
                const filePath = line.substring(3).trim();

                let additions = 0;
                let deletions = 0;
                try {
                  const { stdout: numstat } = await execAsync(`git -C "${targetPath}" diff --numstat HEAD -- "${filePath}"`);
                  if (numstat.trim()) {
                    const parts = numstat.trim().split(/\s+/);
                    additions = parseInt(parts[0], 10) || 0;
                    deletions = parseInt(parts[1], 10) || 0;
                  }
                } catch {}

                files.push({
                  path: filePath,
                  status: status === '??' ? 'untracked' : status === 'M' ? 'modified' : status === 'A' ? 'added' : 'changed',
                  code: status,
                  additions,
                  deletions
                });
              }

              res.end(JSON.stringify({
                success: true,
                projectPath: targetPath,
                branch,
                clean: files.length === 0,
                files
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 3. Real Git Diff
          if (req.url.startsWith('/api/dev/git-diff')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const url = new URL(req.url, 'http://localhost:5173');
            const targetPath = url.searchParams.get('project') || '/Users/sathish.s/Documents/genisus';
            const file = url.searchParams.get('file');

            try {
              let diffCmd = `git -C "${targetPath}" diff HEAD`;
              if (file) {
                diffCmd += ` -- "${file}"`;
              }

              let { stdout: diff } = await execAsync(diffCmd);

              // If unstaged diff is empty, check diff --cached or untracked
              if (!diff && file) {
                const fullFilePath = path.join(targetPath, file);
                if (fs.existsSync(fullFilePath)) {
                  const content = fs.readFileSync(fullFilePath, 'utf8');
                  const lines = content.split('\n');
                  diff = `--- /dev/null\n+++ b/${file}\n@@ -0,0 +1,${lines.length} @@\n` + lines.map(l => `+${l}`).join('\n');
                }
              }

              res.end(JSON.stringify({ success: true, diff: diff || 'No uncommitted changes detected.' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 4. Open in Real IDE (VS Code, Android Studio, Xcode)
          if (req.url.startsWith('/api/dev/open-ide') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const projectPath = body.projectPath || '/Users/sathish.s/Documents/genisus';
            const filePath = body.filePath ? path.join(projectPath, body.filePath) : projectPath;
            const ide = body.ide || 'vscode';

            try {
              let cmd = '';
              const vscodeCli = '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code';

              if (ide === 'vscode' && fs.existsSync(vscodeCli)) {
                cmd = `"${vscodeCli}" "${filePath}"`;
              } else if (ide === 'android-studio') {
                cmd = `open -a "Android Studio" "${projectPath}"`;
              } else if (ide === 'xcode') {
                cmd = `open -a "Xcode" "${projectPath}"`;
              } else {
                cmd = `open "${filePath}"`;
              }

              await execAsync(cmd);
              res.end(JSON.stringify({ success: true, message: `Opened in ${ide}`, cmd }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 5. Run Real Build or Test Command
          if (req.url.startsWith('/api/dev/run-test') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const targetPath = body.projectPath || '/Users/sathish.s/Documents/genisus';
            const cmd = body.command || 'npm run build';
            const startTime = Date.now();

            try {
              const { stdout, stderr } = await execAsync(cmd, { cwd: targetPath });
              const duration = ((Date.now() - startTime) / 1000).toFixed(2);
              res.end(JSON.stringify({
                success: true,
                passed: true,
                duration: `${duration}s`,
                stdout,
                stderr
              }));
            } catch (err) {
              const duration = ((Date.now() - startTime) / 1000).toFixed(2);
              res.end(JSON.stringify({
                success: false,
                passed: false,
                duration: `${duration}s`,
                error: err.message,
                stdout: err.stdout,
                stderr: err.stderr
              }));
            }
            return;
          }

          // 6. Real Git Commit
          if (req.url.startsWith('/api/dev/git-commit') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const targetPath = body.projectPath || '/Users/sathish.s/Documents/genisus';
            const message = body.message || 'chore: automated development update';
            const branch = body.branch;

            try {
              if (branch) {
                await execAsync(`git -C "${targetPath}" checkout -B "${branch}"`);
              }
              await execAsync(`git -C "${targetPath}" add .`);
              const { stdout: commitOut } = await execAsync(`git -C "${targetPath}" commit -m "${message.replace(/"/g, '\\"')}"`);
              const { stdout: shaOut } = await execAsync(`git -C "${targetPath}" rev-parse --short HEAD`);

              res.end(JSON.stringify({
                success: true,
                commitHash: shaOut.trim(),
                output: commitOut
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 7. Real Git Push
          if (req.url.startsWith('/api/dev/git-push') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const targetPath = body.projectPath || '/Users/sathish.s/Documents/genisus';
            const branch = body.branch || 'main';

            try {
              const { stdout, stderr } = await execAsync(`git -C "${targetPath}" push origin "${branch}"`);
              res.end(JSON.stringify({
                success: true,
                output: stdout || stderr || 'Pushed cleanly to origin'
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 8. Full Real-Time Autonomous AI Development Pipeline (Python Astra Agent)
          if (req.url.startsWith('/api/dev/ai-develop') && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const targetPath = body.projectPath || '/Users/sathish.s/Documents/genisus';
            const requirement = body.requirement || 'Autonomous verification and telemetry update';
            const mode = body.mode || 'MODE_C_AUTONOMOUS';
            const autoPush = body.autoPush === true || mode === 'MODE_C_AUTONOMOUS';

            const agentScript = path.join(__dirname, 'python', 'astra_dev_agent.py');
            const autoPushFlag = autoPush ? '--auto-push' : '';
            const cmd = `python3 "${agentScript}" --project "${targetPath}" --requirement "${requirement.replace(/"/g, '\\"')}" --mode "${mode}" ${autoPushFlag} --json`;

            try {
              const { stdout, stderr } = await execAsync(cmd, { cwd: targetPath, maxBuffer: 10 * 1024 * 1024 });
              let parsedResult = null;
              try {
                parsedResult = JSON.parse(stdout.trim());
              } catch (parseErr) {
                parsedResult = {
                  success: true,
                  rawOutput: stdout,
                  stderr
                };
              }

              res.end(JSON.stringify({
                success: true,
                result: parsedResult
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                error: err.message,
                stdout: err.stdout,
                stderr: err.stderr
              }));
            }
            return;
          }

          // 9. Pipeline Status Check
          if (req.url.startsWith('/api/dev/pipeline-status')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const url = new URL(req.url, 'http://localhost:5173');
            const targetPath = url.searchParams.get('project') || '/Users/sathish.s/Documents/genisus';

            try {
              const { stdout: statusOut } = await execAsync(`git -C "${targetPath}" status --porcelain`);
              const { stdout: branchOut } = await execAsync(`git -C "${targetPath}" branch --show-current`);
              const { stdout: logOut } = await execAsync(`git -C "${targetPath}" log -1 --format="%h|%s|%an|%ar"`);
              
              res.end(JSON.stringify({
                success: true,
                clean: !statusOut.trim(),
                branch: branchOut.trim() || 'main',
                lastCommit: logOut.trim()
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // -------------------------------------------------------------
          // 10. BACKGROUND LOGICAL LLM TASK & ACTIVITY AGENT APIS
          // -------------------------------------------------------------

          // 10.1 List Background Tasks
          if (req.url === '/api/agent/tasks' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const agentScript = path.join(__dirname, 'python', 'llm_task_agent.py');
            try {
              const { stdout } = await execAsync(`python3 "${agentScript}" --list-tasks --json`);
              res.end(stdout.trim() || '[]');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 10.2 Enqueue Task into Background Logical Engine
          if (req.url === '/api/agent/enqueue' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const directive = body.directive || 'Autonomous Sprint Goal';
            const priority = body.priority || 'MEDIUM';
            const category = body.category || 'General';

            const agentScript = path.join(__dirname, 'python', 'llm_task_agent.py');
            const cmd = `python3 "${agentScript}" --create-task "${directive.replace(/"/g, '\\"')}" --priority "${priority}" --category "${category}" --json`;
            try {
              const { stdout } = await execAsync(cmd);
              res.end(stdout.trim() || '{}');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 10.3 Step Background Activity
          if (req.url === '/api/agent/step' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const taskId = body.taskId ? `"${body.taskId}"` : '';

            const agentScript = path.join(__dirname, 'python', 'llm_task_agent.py');
            const cmd = `python3 "${agentScript}" --step ${taskId} --json`;
            try {
              const { stdout } = await execAsync(cmd);
              res.end(stdout.trim() || '{}');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 10.4 Run Task To Completion in Background
          if (req.url === '/api/agent/run-task' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const body = await parseBody();
            const taskId = body.taskId;
            if (!taskId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Missing taskId' }));
              return;
            }

            const agentScript = path.join(__dirname, 'python', 'llm_task_agent.py');
            const cmd = `python3 "${agentScript}" --run-task "${taskId}" --json`;
            try {
              const { stdout } = await execAsync(cmd);
              res.end(stdout.trim() || '{}');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // 10.5 Background Engine Telemetry Status
          if (req.url === '/api/agent/status') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const agentScript = path.join(__dirname, 'python', 'llm_task_agent.py');
            try {
              const { stdout } = await execAsync(`python3 "${agentScript}" --status --json`);
              res.end(stdout.trim() || '{}');
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
            return;
          }

          // -------------------------------------------------------------
          // 11. GPT-6 ASTRA & OPENAI FRONTIER / FREE AI BRIDGE
          // -------------------------------------------------------------

          // 11.1 Query OpenAI / Custom AI Endpoint
          if (req.url === '/api/ai/ask' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            try {
              const body = await parseBody();
              const query = body.query || '';
              const isTamil = body.isTamil || false;
              const model = body.model || 'gpt-4o-mini';
              const apiKey = body.apiKey || process.env.OPENAI_API_KEY || '';
              const baseUrl = body.baseUrl || 'https://api.openai.com/v1';

              if (!query) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Empty query' }));
                return;
              }

              if (apiKey) {
                const systemPrompt = `You are GPT-6 Astra, the cognitive AI intelligence core of GENISUS AI Operating System for Commander Sathish (@sathishkhan27).
You are an expert full-stack engineer and strategic assistant.
Provide structured, highly professional, direct answers with complete code snippets, markdown tables, step-by-step guides, and actionable commands.
${isTamil ? 'The user asked in Tamil. Please answer primarily in natural, fluent Tamil with proper technical English terminology.' : 'Answer in clear, engaging English.'}`;

                const apiRes = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                    model,
                    messages: [
                      { role: 'system', content: systemPrompt },
                      { role: 'user', content: query }
                    ],
                    temperature: 0.7,
                    max_tokens: 2500
                  })
                });

                if (apiRes.ok) {
                  const data = await apiRes.json();
                  const answer = data?.choices?.[0]?.message?.content || '';
                  res.end(JSON.stringify({
                    success: true,
                    provider: 'OpenAI Frontier API',
                    model: data.model || model,
                    answer,
                    tokens: data.usage
                  }));
                  return;
                } else {
                  const errText = await apiRes.text();
                  console.warn('[OpenAI API] Error response:', errText);
                  res.end(JSON.stringify({
                    success: false,
                    error: `API error (${apiRes.status}): ${errText}`,
                    fallback: true
                  }));
                  return;
                }
              }

              // No API key -> Signal fallback to built-in GPT-6 Astra Deep Reasoning Engine
              res.end(JSON.stringify({
                success: false,
                fallback: true,
                message: 'No OpenAI API key provided. Using built-in GPT-6 Astra Intelligence Core.'
              }));
            } catch (err) {
              res.end(JSON.stringify({
                success: false,
                error: err.message,
                fallback: true
              }));
            }
            return;
          }

          // 11.2 Check Available Models & AI Service Status
          if (req.url === '/api/ai/status') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            const hasEnvKey = !!process.env.OPENAI_API_KEY;
            res.end(JSON.stringify({
              success: true,
              engine: 'GPT-6 Astra Omni v6.2 / OpenAI Bridge',
              hasEnvKey,
              defaultModel: 'gpt-6-astra',
              availableModels: [
                { id: 'gpt-6-astra', name: 'GPT-6 Astra Omni v6.2 (Built-in Free High-Speed Engine)', tier: 'FREE' },
                { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o-mini (Fast & Intelligent)', tier: 'API_KEY_OR_FREE' },
                { id: 'gpt-4o', name: 'OpenAI GPT-4o (Frontier Multimodal Engine)', tier: 'API_KEY' },
                { id: 'o3-mini', name: 'OpenAI o3-mini (High-Reasoning STEM / Coding)', tier: 'API_KEY' }
              ]
            }));
            return;
          }

          // -------------------------------------------------------------
          // 12. ENTERPRISE AI AGENT & GOVERNANCE REST API
          // -------------------------------------------------------------
          if (req.url.startsWith('/api/governance/')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');

            if (req.url === '/api/governance/status') {
              res.end(JSON.stringify({
                status: 'ACTIVE',
                framework: 'Zero-Trust Architecture & GRC',
                complianceCoverage: ['ISO-27001', 'SOC-2', 'DPDP-2023', 'RBI-AI'],
                policyEngine: 'ONLINE',
                approvalEngine: 'ONLINE',
                auditChain: 'VALIDATED'
              }));
              return;
            }

            if (req.url === '/api/governance/telemetry') {
              res.end(JSON.stringify({
                totalInvocations: 1420,
                policyBlocks: 12,
                haltedForApproval: 14,
                activeAgents: 8,
                tokensConsumed: 1845200,
                estimatedCostUSD: 4.82,
                p95LatencyMs: 412
              }));
              return;
            }

            if (req.url === '/api/governance/approvals') {
              res.end(JSON.stringify({
                pendingCount: 2,
                items: [
                  { id: 'APP-101', title: 'Deploy Hotfix v2.4.1 to Production Cluster', riskLevel: 'HIGH', status: 'PENDING' },
                  { id: 'APP-102', title: 'Authorize Cloud Infrastructure Payout ₹24,850', riskLevel: 'MEDIUM', status: 'PENDING' }
                ]
              }));
              return;
            }
          }

          next();
        });
      }
    }
  ]
});

