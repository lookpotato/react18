import path from 'path';
import { resolvePkgPath, getPackageJSON, getBaseRollupPlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJSON('react-dom');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);

export default {
  input: `${pkgPath}/${module}`,
  output: {
    file: `${pkgDistPath}/index.js`,
    name: 'ReactDOM',
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
        version,
        peerDependencies: {
          react: version
        }
      })
    })
  ]
};
