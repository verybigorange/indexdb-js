const rollup = require('rollup'); 
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const {uglify} = require('rollup-plugin-uglify');
const chalk = require('chalk');
const rmrf = require('rmrf');

rmrf('dist/');

// see below for details on the options
const inputOptions = {
  input: 'src/Idb.js',
  plugins:[
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
const outputOptions = {
  file: 'dist/Idb.js',
  format: 'umd',
  name: 'Idb'
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);


  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build().then(()=>{
  console.log(chalk.green('打包完成！^-^\n'))
});