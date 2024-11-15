import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-commonjs';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

function resolvePkgPath(pkgName, isDist = false) {
  if (pkgName === 'react-dom') {
    return `${path.resolve(__dirname, '../../packages/react')}/${isDist ? 'dist' : ''}/react-dom`;
  }
  return `${pkgPath}/${pkgName}`;
}

function getPackageJSON(pkgName) {
  const path = pkgName === 'react-dom' 
    ? `${resolvePkgPath('react')}/react-dom/package.json`
    : `${resolvePkgPath(pkgName)}/package.json`;
    
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
}

function getBaseRollupPlugins({ alias = { __DEV__: true, preventAssignment: true }, typescript = {} } = {}) {
  return [
    replace(alias),
    cjs(),
    ts(typescript)
  ];
}

export { resolvePkgPath, getPackageJSON, getBaseRollupPlugins };
