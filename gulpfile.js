const gulp = require('gulp');

const PATHS = {
    scripts: ['./src/**/*.ts'],
    output: './lib'
}

gulp.task('copyFiles',()=>{
    return gulp.src([
        'src/**/*',
        '!src/**/*.ts',
        '!src/**/*.js'          
    ]).pipe(gulp.dest(PATHS.output));
});

gulp.task('default',['copyFiles']);