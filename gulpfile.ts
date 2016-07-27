declare var process;
declare var require;

const gulp = require('gulp');
const shell = require('gulp-shell');
const ts = require('gulp-typescript');
const rollup = require('rollup');
const rollupResolveNode = require('rollup-plugin-node-resolve');
const runSequence = require('run-sequence');

class RxRewriter {
  resolveId(id, from) {
    if(id.startsWith('rxjs/')){
      return `${process.cwd()}/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
    }
    if(id.startsWith('@angular/core')){
        if(id === '@angular/core'){
            return `${process.cwd()}/node_modules/@angular/core/esm/index.js`;
        }
        return `${process.cwd()}/node_modules/@angular/core/esm/${id.split('@angular/core').pop()}.js`;
    }
    if(id.startsWith('@angular/common')){
        if(id === '@angular/common'){
            return `${process.cwd()}/node_modules/@angular/common/esm/index.js`;
        }
        return `${process.cwd()}/node_modules/@angular/common/esm/${id.split('@angular/common').pop()}.js`;
    }
    if(id.startsWith('@angular/platform-browser')){
        if(id === '@angular/platform-browser'){
            return `${process.cwd()}/node_modules/@angular/platform-browser/esm/index.js`;
        }
        return `${process.cwd()}/node_modules/@angular/platform-browser/esm/${id.split('@angular/platform-browser').pop()}.js`;
    }
    if(id.startsWith('@angular/platform-browser-dynamic')){
        if(id === '@angular/platform-browser-dynamic'){
            return `${process.cwd()}/node_modules/@angular/platform-browser-dynamic/esm/index.js`;
        }
        return `${process.cwd()}/node_modules/@angular/platform-browser-dynamic/esm/${id.split('@angular/platform-browser-dynamic').pop()}.js`;
    }
  }
}

gulp.task('default', done => {
  console.log('typescript!');
  done();
});

gulp.task('task:build', done => runSequence(
  'task:compile',
  'task:deploy:prep',
  done
))

gulp.task('task:compile', done => runSequence(
  'task:compile:angular',
  'task:compile:rollup',
  'task:compile:downlevel',
  done
));

gulp.task('task:compile:angular', shell.task([
  'node_modules/.bin/ngc'
]));

gulp.task('task:compile:rollup', done => {
  rollup
    .rollup({
      entry: 'tmp/ngc/app/main.js',
      plugins: [
        new RxRewriter(),
        rollupResolveNode({
          jsnext: true,
          main: true,
          extensions: ['.js'],
          preferBuiltins: false
        })
      ]
    })
    .then(bundle => bundle.write({
      format: 'cjs',
      dest: 'tmp/rollup/app.js'
    }))
    .catch(err => {
      console.error(err);
    })
    .then(() => done());
})

gulp.task('task:compile:downlevel', () => gulp
  .src([
    'tmp/rollup/app.js'
  ])
  .pipe(ts({
    'module': 'commonjs',
    'target': 'es5',
    'allowJs': true
  }))
  .pipe(gulp.dest('tmp/es5')));

gulp.task('task:deploy:prep', () => gulp
  .src([
    'tmp/es5/app.js',
    'app/**/*.html'
  ].concat([
    'zone.js/dist/zone.min.js'
  ].map(path => `node_modules/${path}`)))
  .pipe(gulp.dest('dist')));