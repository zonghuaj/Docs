FROM nginx:1.15.9-alpine
VOLUME /tmp
# replace default nginx conf file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# deploy static file
COPY dist /usr/share/nginx/html
