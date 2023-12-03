import generatePackageJson from 'rollup-plugin-generate-package-json';
import { resolvePkgPath, getPackageJSON, getBaseRollupPlugins } from './utils';

const { name, module } = getPackageJSON('react');
//react包路径
const pkgPath = resolvePkgPath(name);
//react打包产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	//react 包
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd',
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, version, description }) => ({
					name,
					version,
					description,
					main: 'index.js',
				}),
			}),
		],
	},
	//jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			//jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd',
			},
			//jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd',
			},
		],
		plugins: [...getBaseRollupPlugins()],
	},
];
