import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');
//获得JSON文件对象
const getPackageJSON = (pkgName) => {
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
};
//获得包路径
const resolvePkgPath = (pkgName, isDist) => {
	if (isDist) {
		return path.resolve(distPath, pkgName);
	}
	return path.resolve(pkgPath, pkgName);
};

//获取所有rollup基础plugin
const getBaseRollupPlugins = ({
	alias = {
		__DEV__: true,
	},
	typescript = {},
} = {}) => {
	return [replace(alias), ts(typescript), cjs()];
};

export { getPackageJSON, resolvePkgPath, getBaseRollupPlugins };
