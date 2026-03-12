const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const argVersion = process.argv[2];

function getRootVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  return pkg.version;
}

const targetVersion = argVersion || getRootVersion();

console.log(`Syncing versions to: ${targetVersion}`);

// 1. Update root package.json if arg was provided
if (argVersion) {
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  rootPkg.version = targetVersion;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
}

// 2. Find all package.json files in packages/*
const packagesDir = path.join(rootDir, 'packages');
const packageDirs = fs.readdirSync(packagesDir);

packageDirs.forEach(dir => {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    console.log(`Updating ${pkgPath}`);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = targetVersion;
    
    // Update internal dependencies
    const updateDeps = (deps) => {
      if (!deps) return;
      Object.keys(deps).forEach(dep => {
        if (dep.startsWith('@morphql/')) {
          // If it's not "*" or "workspace:*", update it to the target version
          if (deps[dep] !== '*' && !deps[dep].startsWith('workspace:') && !deps[dep].startsWith('file:')) {
            deps[dep] = `^${targetVersion}`;
          }
        }
      });
    };
    
    updateDeps(pkg.dependencies);
    updateDeps(pkg.devDependencies);
    updateDeps(pkg.peerDependencies);
    
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
});

// 3. Update JetBrains extension (build.gradle.kts)
const jetbrainsGradlePath = path.join(packagesDir, 'jetbrains-extension', 'build.gradle.kts');
if (fs.existsSync(jetbrainsGradlePath)) {
  console.log(`Updating ${jetbrainsGradlePath}`);
  let content = fs.readFileSync(jetbrainsGradlePath, 'utf8');
  content = content.replace(/version = "[^"]+"/, `version = "${targetVersion}"`);
  fs.writeFileSync(jetbrainsGradlePath, content);
}

// 4. Update CLI version (src/index.ts)
const cliIndexPath = path.join(packagesDir, 'cli', 'src', 'index.ts');
if (fs.existsSync(cliIndexPath)) {
  console.log(`Updating ${cliIndexPath}`);
  let content = fs.readFileSync(cliIndexPath, 'utf8');
  content = content.replace(/\.version\("[^"]+"\)/, `.version("${targetVersion}")`);
  fs.writeFileSync(cliIndexPath, content);
}


// 5. Update Playground version (src/Playground.tsx)
const playgroundPath = path.join(packagesDir, 'playground', 'src', 'Playground.tsx');
if (fs.existsSync(playgroundPath)) {
  console.log(`Updating ${playgroundPath}`);
  let content = fs.readFileSync(playgroundPath, 'utf8');
  content = content.replace(/Version: \d+\.\d+\.\d+(?:-\w+)?/, `Version: ${targetVersion}`);
  fs.writeFileSync(playgroundPath, content);
}

// 6. Update Python package (pyproject.toml)
const pyprojectPath = path.join(packagesDir, 'python', 'pyproject.toml');
if (fs.existsSync(pyprojectPath)) {
  console.log(`Updating ${pyprojectPath}`);
  let content = fs.readFileSync(pyprojectPath, 'utf8');
  content = content.replace(/^version = "[^"]+"/m, `version = "${targetVersion}"`);
  fs.writeFileSync(pyprojectPath, content);
}

// 7. Update n8n node version (packages/n8n-node/src/MorphQLTransform.ts)
const n8nNodePath = path.join(packagesDir, 'n8n-node', 'src', 'MorphQLTransform.ts');
if (fs.existsSync(n8nNodePath)) {
  console.log(`Updating ${n8nNodePath}`);
  let content = fs.readFileSync(n8nNodePath, 'utf8');
  content = content.replace(/const VERSION = "[^"]+"/, `const VERSION = "${targetVersion}"`);
  fs.writeFileSync(n8nNodePath, content);
}

console.log('Version synchronization complete!');

console.log('\x1b[33m%s\x1b[0m', 'IMPORTANT: Remember to run "npm install" at the root to update the lockfile.');

