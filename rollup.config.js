import typescript from 'rollup-plugin-typescript3'
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'index',
            globals: {
                superagent: 'superagent',
                uuid: 'uuid'
            }
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            useTsconfigDeclarationDir: true
        }),
        uglify(),
    ],
}