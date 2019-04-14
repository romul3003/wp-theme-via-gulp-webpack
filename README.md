# wp-theme-via-gulp-webpack
Template of Wordpress theme with task runner gulp + webpack

1. You have to install wordpress to you local php-server.
2. Copy all files to your local wordpress project theme -> your-project/wp-content/themes/your-theme.
3. Before install Gulp, you should make sure that you have Node and npm installed on your machine.
4. Your have to install gulp cli globally. In your console panel write: npm install --global gulp-cli
5. In your console panel write: "npm i" (without quotes) to install all node modules and dependencies.
6. In package.json change "name": "theme-name" to your theme name.
7. In gulpfile.babel.js in serve function proxy: "http://localhost/your-site/" put your local website link
8. There are 2 configurations: development and production. To run development, in your console panel write: npm start.
To run production - write: npm run build

If something goes wrong, read the article: https://css-tricks.com/gulp-for-wordpress-initial-setup/
