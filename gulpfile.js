const log = true;

const use_preprocessor = "scss";

const css_preprocessor = (use_preprocessor === "less" ? "less" : "sass");

const { src, dest, watch, parallel, series } = require("gulp");

const gulp_if = require("gulp-if");

const browser_sync = require("browser-sync").create();

const gh_pages = require("gh-pages");

const html_min = require("gulp-htmlmin");

const clean_css = require("gulp-clean-css");

const sass = require("gulp-sass");
const less = require("gulp-less");

const terser = require("gulp-terser");

const image_min = require("gulp-imagemin");

const newer = require("gulp-newer");

const debug = require("gulp-debug");

const del = require("del");

const opt = { title: "log", showCount: false };

const css_opt = { level: { 1: { specialComments: 0 } } };

const deploy_result = function (err) {
                          if (err) { console.log(`Deploy Error: ${err}`); }
                      };


function browserSync() {
    browser_sync.init({               
        server: { baseDir: "build/" },
        notify: false,                 
        online: true                   
    })
}

function html() {
    return src("app/**/*.html")            
          .pipe(newer("build/"))          
          .pipe(html_min                   
              ({ collapseWhitespace: true,
                 removeComments: true }))
          .pipe(gulp_if(log, debug(opt)))  
          .pipe(dest("build/"));           
}

function css() {
    return src("app/css/*.css",           
               { base: "app" })           
          .pipe(newer("build/"))          
          .pipe(gulp_if(log, debug(opt))) 
          .pipe(clean_css(css_opt))       
          .pipe(dest("build/"))           
          .pipe(browser_sync.stream());  
}

function preprocessCss() {
    return src(`app/${use_preprocessor}` + 
               `/*.${use_preprocessor}`)  
          .pipe(gulp_if(log, debug(opt)))  
          .pipe(eval(css_preprocessor)()) 
          .pipe(clean_css(css_opt))        
          .pipe(dest("build/css/"))       
          .pipe(browser_sync.stream());    
}

function js() {
    return src("app/js/*.js",            
               { base: "app" })          
          .pipe(newer("build/"))         
          .pipe(terser())                 
          .pipe(gulp_if(log, debug(opt))) 
          .pipe(dest("build/"));          
}

function txt() {
    return src("app/data/**/*.txt",       
               { base: "app" })           
          .pipe(newer("build/"))          
          .pipe(gulp_if(log, debug(opt))) 
          .pipe(dest("build/"));          
}


function img() {
    return src(["app/img/**/*.{png,jpg,jpeg,gif}",
                "app/data/**/*.{png,jpg,jpeg,gif}"], 
               { base: "app" })                      
          .pipe(newer("build/"))                     
          .pipe(image_min({ verbose: log,
                            silent: !log }))         
          .pipe(dest("build/"));                     
}

function cleanBuild() {
    return del("build/**/*", { force: true });  
}

function watchForFiles() {

    watch("app/**/*.html")
   .on("all", series(html, browser_sync.reload));

    watch("app/css/*.css")
   .on("all", series(css));

    watch(`app/${use_preprocessor}/*.${use_preprocessor}`)
   .on("all", series(preprocessCss));

    watch("app/js/*.js")
   .on("all", series(js, browser_sync.reload));

    watch("app/data/**/*.txt")
   .on("all", series(txt, browser_sync.reload));

    watch("app/img/**/*")
   .on("all", series(img, browser_sync.reload));

}

function deployOnGitHub() {
    return gh_pages
          .publish("build",                              
                   { message: "Auto-generated commit" },
                   deploy_result);                       
}

exports.build = series(cleanBuild, html, css, preprocessCss, js, txt, img);

exports.default = parallel(series(exports.build, browserSync), watchForFiles);

exports.deploy = series(exports.build, deployOnGitHub);