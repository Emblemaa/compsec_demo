FROM nginx:latest
WORKDIR /nginx
COPY . /nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d/