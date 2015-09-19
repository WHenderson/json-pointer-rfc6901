gulp = require('gulp')
gCoffee = require('gulp-coffee')
gUtil = require('gulp-util')
gClean = require('gulp-clean')
gMocha = require('gulp-spawn-mocha')
gLazy = require('lazypipe')
gMirror = require('gulp-mirror')
gUmd = require('gulp-umd')
gConcat = require('gulp-concat')
gSourceMaps = require('gulp-sourcemaps')
gRename = require('gulp-rename')
gUglify = require('gulp-uglify')
gCoffeeLint = require('gulp-coffeelint')
gCoverageEnforcer = require("gulp-istanbul-enforcer");

EXPORT = 'JsonPointer'
NAMESPACE = 'JSON.pointer'

pipeCoffee = gLazy()
.pipe(gUmd, {
    templateSource: '''
  <%= contents %>
  module.exports = <%= exports %>
  '''
    exports: (file) ->
      EXPORT
  })

pipeNode = gLazy()
.pipe(gUmd,{
    templateName: 'node',
    exports: (file) ->
      EXPORT
    namespace: (file) ->
      NAMESPACE
  })
.pipe(gRename, {
    suffix: '.node'
  })

pipeBrowser = gLazy()
.pipe(gUmd,{
    templateName: 'amdWeb',
    exports: (file) ->
      EXPORT
    namespace: (file) ->
      NAMESPACE
  })
.pipe(gRename, {
    suffix: '.web'
  })

pipeUmd = gLazy()
.pipe(gUmd,{
    templateName: 'amdNodeWeb',
    exports: (file) ->
      EXPORT
    namespace: (file) ->
      NAMESPACE
  })
.pipe(gRename, {
    suffix: '.umd'
  })

createUglifyPipe = (pipe) ->
  pipe
  .pipe(gUglify, {
      preserveComments: 'some'
    })
  .pipe(
    gRename,
    (path) ->
      path.extname = '.min' + path.extname
      return
  )

gulpClean = () ->
  gulp
  .src(['dist/', 'coverage/'], { read: false })
  .pipe(gClean())

gulpBuild = () ->
  gulp
  .src([
      'src/json-pointer.coffee'
    ])
  #.pipe(gConcat('json-pointer.coffee', { newLine: '\r\n' }))
  .pipe(gCoffeeLint())
  .pipe(gCoffeeLint.reporter())
  .pipe(gMirror(
      pipeCoffee(),
      (
        gLazy()
        .pipe(gSourceMaps.init)
        #.pipe(gConcat, 'json-pointer.coffee')
        .pipe(gCoffee, { bare: true })
        .pipe(
          gMirror,
          pipeNode(),
          pipeBrowser(),
          pipeUmd(),
          createUglifyPipe(pipeBrowser)(),
          createUglifyPipe(pipeUmd)()
        )
        .pipe(gSourceMaps.write)
      )()
    ))
  .pipe(gulp.dest('dist'))

gulpTestCoverage = () ->
  gulp
  .src(
    [
      'test/coverage.coffee'
    ],
    {
      read: false
    }
  )
  .pipe(gMocha({
      debugBrk: false
      r: 'test/coverage-setup.js'
      R: 'spec'
      u: 'tdd'
      istanbul: {

      }
    }))
  .pipe(gCoverageEnforcer({
      thresholds : {
        statements : 100,
        branches : 100,
        lines : 100,
        functions : 100
      },
      coverageDirectory : 'coverage',
      rootDirectory : ''
    }))

gulpTestExamples = () ->
  gulp
  .src(
    [
      'test/examples.coffee'
    ],
    {
      read: false
    }
  )
  .pipe(gMocha({
      debugBrk: false
      r: 'test/examples-setup.js'
      R: 'spec'
      u: 'tdd'
      istanbul: false
    }))

gulp.task('discrete-clean', () ->
  gulpClean()
)

gulp.task('discrete-build', () ->
  gulpBuild()
)

gulp.task('discrete-test-coverage', () ->
  gulpTestCoverage()
)

gulp.task('discrete-test-examples', () ->
  gulpTestExamples()
)

gulp.task('chained-clean', () ->
  gulpClean()
)
gulp.task('chained-build', ['chained-clean'], () ->
  gulpBuild()
)
gulp.task('chained-test-coverage', ['chained-build'], () ->
  gulpTestCoverage()
)
gulp.task('chained-test-examples', ['chained-test-coverage'], () ->
  gulpTestExamples()
)
gulp.task('chained-complete', ['chained-test-examples'], (cb) ->
  cb()
)

gulp.task('test', ['chained-test-examples'], (cb) ->
  cb()
)

gulp.task('dist-version', ['chained-complete'], (cb) ->
  fs = require('fs')

  cfgNpm = require('./package.json')
  cfgBower = require('./bower.json')
  cfgBower.version = cfgNpm.version

  fs.writeFileSync('./bower.json', JSON.stringify(cfgBower, null, '  '))

  cb()
  return
)

gulp.task('dist-git', ['dist-version'], (cb) ->
  exec = require('child_process').execSync
  cfgNpm = require('./package.json')

  exec('git add bower.json')
  exec('git add -f dist/json-pointer.coffee')
  exec('git add -f dist/json-pointer.node.js')
  exec('git add -f dist/json-pointer.umd.js')
  exec('git add -f dist/json-pointer.umd.min.js')
  exec('git add -f dist/json-pointer.web.js')
  exec('git add -f dist/json-pointer.web.min.js')
  exec('git checkout head')
  exec("git commit -m \"Version #{cfgNpm.version} for distribution\"")
  exec("git tag -a v#{cfgNpm.version} -m \"Add tag v#{cfgNpm.version}\"")
  exec('git checkout master')
  exec('git push origin --tags')

  cb()
  return
)
