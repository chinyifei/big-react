import generatePackageJson from 'rollup-plugin-generate-package-json';
import { resolvePkgPath, getPackageJSON, getBaseRollupPlugins } from './utils';
import alias from '@rollup/plugin-alias';
const { name, module } = getPackageJSON('react-dom');
//react包路径
const pkgPath = resolvePkgPath(name);
//react打包产物路径
const pkgDistPath = resolvePkgPath(name, true);
export default [
	//react 包
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'index.js',
				format: 'umd',
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client.js',
				format: 'umd',
			},
		],
		plugins: [
			...getBaseRollupPlugins(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`,
				},
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, version, description }) => ({
					name,
					version,
					peerDependencies: {
						react: version,
					},
					description,
					main: 'index.js',
				}),
			}),
		],
	},
];
