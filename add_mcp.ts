import * as fs from 'fs';
import * as path from 'path';

const confPath = path.join(
  process.env.APPDATA || '', 
  'Cursor', 
  'User', 
  'globalStorage', 
  'rooveterinaryinc.roo-cline', 
  'settings', 
  'cline_mcp_settings.json'
);

// We'll write to another config if not in roo-cline, but let's just make it available to the IDE's MCP settings
const cursorConfPath = path.join(
  process.env.APPDATA || '',
  'Cursor',
  'User',
  'globalStorage',
  'saoudrizwan.claude-dev',
  'settings',
  'cline_mcp_settings.json'
);

function addStripe(p: string) {
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    let conf: any = { mcpServers: {} };
    if (fs.existsSync(p)) {
      conf = JSON.parse(fs.readFileSync(p, 'utf8'));
    }
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/STRIPE_SECRET_KEY=(.*)/);
    const key = match ? match[1].replace(/^"|"$/g, '') : '';
    
    conf.mcpServers = conf.mcpServers || {};
    conf.mcpServers.stripe = {
      command: 'npx',
      args: ['-y', '@stripe/mcp@latest'],
      env: { STRIPE_SECRET_KEY: key }
    };
    fs.writeFileSync(p, JSON.stringify(conf, null, 2));
    console.log(`Added Stripe MCP to ${p}`);
  } catch (e) {
    console.error(`Failed to add to ${p}`, e);
  }
}

addStripe(confPath);
addStripe(cursorConfPath);
