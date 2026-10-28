// Generates the parts of terraform/modules/cloudfront_intercode that can't read routing.json themselves (a CloudFront
// Function can't read files, and nginx has its own syntax). Terraform reads routing.json directly.
//
//   node script/genRouting.mjs          write the generated files
//   node script/genRouting.mjs --check  fail if they're out of date
import fs from 'node:fs';
import path from 'node:path';
import * as prettier from 'prettier';

const moduleDir = 'terraform/modules/cloudfront_intercode';
const routing = JSON.parse(fs.readFileSync(path.join(moduleDir, 'routing.json'), 'utf8'));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

// A trailing "/*" is a CloudFront prefix pattern ("/users/*" matches "/users/x" but not "/users"); anything else is an
// exact path
const bypassPaths = [...routing.rails_paths, ...routing.shell_paths, ...routing.asset_paths];
const exactPaths = bypassPaths.filter((p) => !p.endsWith('/*')).map(escapeRegex);
const prefixPaths = bypassPaths.filter((p) => p.endsWith('/*')).map((p) => escapeRegex(p.slice(0, -1)));
const bypassRegexSource = `^(?:${exactPaths.join('|')})$|^(?:${prefixPaths.join('|')})`;
const crawlerAlternation = routing.crawler_user_agents.map(escapeRegex).join('|');

const BEGIN = '// BEGIN GENERATED from routing.json by script/genRouting.mjs (yarn routing:codegen). Do not edit.';
const END = '// END GENERATED';

async function generateRouter() {
  const file = path.join(moduleDir, 'crawler_router.js');
  const current = fs.readFileSync(file, 'utf8');
  const start = current.indexOf(BEGIN);
  const end = current.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`${file} is missing its BEGIN/END GENERATED markers`);
  }
  const block = [
    BEGIN,
    `var CRAWLER_UA_RE = /${crawlerAlternation}/i;`,
    '',
    '// Paths that belong to Rails, the assets origin or the shells, and must never be rewritten',
    `var BYPASS_PATH_RE = /${bypassRegexSource}/;`,
    END,
  ].join('\n');
  const source = current.slice(0, start) + block + current.slice(end + END.length);
  const options = (await prettier.resolveConfig(file)) ?? {};
  return [file, await prettier.format(source, { ...options, filepath: file })];
}

function generateNginx() {
  const railsPaths = [...routing.rails_paths, ...routing.shell_paths];
  const exact = railsPaths.filter((p) => !p.endsWith('/*')).map(escapeRegex);
  const prefix = railsPaths.filter((p) => p.endsWith('/*')).map((p) => escapeRegex(p.slice(0, -1)));
  const header = '# Generated from routing.json by script/genRouting.mjs (yarn routing:codegen). Do not edit.';
  const dir = path.join(moduleDir, 'nginx');
  return [
    [
      path.join(dir, 'crawler-map.conf'),
      `${header}
# Include in the http block. $is_crawler is 1 for the crawlers that should get the Open Graph shell.
map $http_user_agent $is_crawler {
    default 0;
    ~*(${crawlerAlternation}) 1;
}
`,
    ],
    [
      path.join(dir, 'rails-locations.conf'),
      `${header}
# Include in the server block. Expects an upstream named "rails" and /etc/nginx/proxy_params.conf. /packs/ is served
# from the assets host, so it isn't listed.
location ~ ^(?:${exact.join('|')})$|^(?:${prefix.join('|')}) {
    proxy_pass http://rails;
    include /etc/nginx/proxy_params.conf;
}
`,
    ],
  ];
}

const outputs = [await generateRouter(), ...generateNginx()];

if (process.argv.includes('--check')) {
  const stale = outputs.filter(([file, content]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content);
  if (stale.length > 0) {
    console.error(
      `Out of date: ${stale.map(([file]) => file).join(', ')}\nRun \`yarn routing:codegen\` and commit the result.`,
    );
    process.exit(1);
  }
} else {
  for (const [file, content] of outputs) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
}
