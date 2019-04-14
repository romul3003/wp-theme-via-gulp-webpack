import {src, dest, watch, series, parallel} from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imageMin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from "browser-sync";
import zip from "gulp-zip";
import info from "./package.json";
import replace from "gulp-replace";
import wpPot from "gulp-wp-pot";

const PRODUCTION = yargs.argv.prod;

export const styles = () => {
    return src(['src/sass/bundle.sass', 'src/sass/admin.sass'])
        .pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on(error, sass.logError))
        .pipe(gulpIf(PRODUCTION, postcss([ autoprefixer({
            grid: true,
            browsers: ['last 2 versions'],
        }) ])))
        .pipe(gulpIf(PRODUCTION, cleanCss({compatibility:'ie8'})))
        .pipe(gulpIf(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('dist/css'))
        .pipe(server.stream());
};

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpIf(PRODUCTION, imageMin()))
        .pipe(dest('dist/images'));
};

export const copy = () => {
    return src(['src/**/*','!src/{images,js,scss,sass}','!src/{images,js,scss,sass}/**/*'])
        .pipe(dest('dist'));
};

export const scripts = () => {
    return src(['src/js/bundle.js','src/js/admin.js'])
        .pipe(named())
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },
            mode: PRODUCTION ? 'production' : 'development',
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            output: {
                filename: '[name].js'
            },
            externals: {
                jquery: 'jQuery'
            },
        }))
        .pipe(dest('dist/js'));
};

export const clean = () => del(['dist']);

const server = browserSync.create();

export const serve = done => {
    server.init({
        proxy: "http://localhost/your-site/" // put your local website link here
    });
    done();
};

export const reload = done => {
    server.reload();
    done();
};

export const compress = () => {
    return src([
        "**/*",
        "!node_modules{,/**}",
        "!bundled{,/**}",
        "!src{,/**}",
        "!.babelrc",
        "!.gitignore",
        "!gulpfile.babel.js",
        "!package.json",
        "!package-lock.json",
    ])
        .pipe(
            gulpIf(
                file => file.relative.split(".").pop() !== "zip",
                replace("_themename", info.name)
            )
        )
        .pipe(zip(`${info.name}.zip`))
        .pipe(dest('bundled'));
};

export const pot = () => {
    return src("**/*.php")
        .pipe(
            wpPot({
                domain: "_themename",
                package: info.name
            })
        )
        .pipe(dest(`languages/${info.name}.pot`));
};


export const watchForChanges = () => {
    watch('src/sass/**/*.{sass,scss}', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch(['src/**/*','!src/{images,js,scss,sass}','!src/{images,js,scss,sass}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch("**/*.php", reload);
};

export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), pot, compress);

export default dev;

