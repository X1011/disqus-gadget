ungit --port=9501 &

#for some reason, when using https, i get a gateway timeout when trying to load the page
browser-sync start --server --files '*.html,*.js,*.css' --port 1024 &

versal preview &
