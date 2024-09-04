FROM nginx:latest

RUN rm -rf /etc/nginx/html

COPY workflow/nginx.conf /etc/nginx/nginx.conf
COPY build /etc/nginx/html

CMD ["nginx", "-g", "daemon off;"]
