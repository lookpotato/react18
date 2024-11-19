import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-commonjs';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

function resolvePkgPath(packageName, isDist = false) {
  const basePath = isDist ? 'dist' : 'src';
  return path.join(__dirname, '../../packages', packageName, basePath);
}

function getPackageJSON(packageName) {
  const packagePath = resolvePkgPath(packageName);
  const packageJsonPath = path.join(packagePath, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

function getBaseRollupPlugins({ alias = { __DEV__: true, preventAssignment: true }, typescript = {} } = {}) {
  return [
    replace(alias),
    cjs(),
    ts(typescript)
  ];
}

export { resolvePkgPath, getPackageJSON, getBaseRollupPlugins };
