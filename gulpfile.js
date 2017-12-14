const gulp = require('gulp'),
    pkg = require('./package.json'),
    BundleHelper = require('maptalks-build-helpers').BundleHelper,
    babel = require('maptalks-rollup-plugin-babel'),
    commonjs = require('rollup-plugin-commonjs'),
    localResolve = require('rollup-plugin-local-resolve'),
    nodeResolve = require('rollup-plugin-node-resolve');

const bundleHelper = new BundleHelper(pkg);

console.log(bundleHelper)

gulp.task('build', () => {
    return bundleHelper.bundle('index.js', {
        'external': [
            'maptalks',
            'rbush'
        ],
        'plugins': [
            localResolve(),
            nodeResolve({
                module: true,
                jsnext: true,
                main: true
            }),
            commonjs(),
            babel({
                plugins: ['transform-proto-to-assign']
            })
        ]
    });
});

gulp.task('minify', ['build'], () => {
    bundleHelper.minify();
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['index.js', './gulpfile.js'], ['build']);
});

/* 
 const TestHelper = require('maptalks-build-helpers').TestHelper;
 const testHelper = new TestHelper();
 const karmaConfig = require('./karma.config.js');

 gulp.task('test', ['build'], () => {
 testHelper.test(karmaConfig);
 });

 gulp.task('tdd', ['build'], () => {
 karmaConfig.singleRun = false;
 gulp.watch(['index.js'], ['test']);
 testHelper.test(karmaConfig);
 }); */

gulp.task('default', ['watch']);
