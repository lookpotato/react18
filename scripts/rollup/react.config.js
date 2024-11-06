import path from 'path';
import { resolvePkgPath, getPackageJSON, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJSON('react');
// react包的路径
const pkgPath = resolvePkgPath(name);
// react产物路径
const pkgDistPath = resolvePkgPath(name, true);

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'React',
      format: 'umd'
    },
    plugins: [
      ...getBaseRollupPlugins({
        typescript: {
          tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
          tsconfigOverride: {
            compilerOptions: {
              declaration: false
            }
          }
        }
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, declaration, version }) => ({
          name,
          main: 'index.js',
          declaration: !!declaration,
          version
        })
      })
    ]
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugins({
      typescript: {
        tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            declaration: false
          }
        }
      }
    })
  }
]