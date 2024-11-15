import path from 'path';
import { resolvePkgPath, getPackageJSON, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

const { name, module, peerDependencies } = getPackageJSON('react-dom');
// react-dom包的路径
const pkgPath = resolvePkgPath(name);
// react-dom产物路径
const pkgDistPath = resolvePkgPath(name, true);

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'index.js',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'client.js',
        format: 'umd'
      }
    ],
    external: [...Object.keys(peerDependencies)],
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
      alias({
        entries: [
          { find: 'hostConfig', replacement: `${pkgPath}/src/hostConfig.ts` }
        ]
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, declaration, version }) => ({
          name,
          main: 'index.js',
          declaration: !!declaration,
          version,
          peerDependencies: {
            react: version
          },
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