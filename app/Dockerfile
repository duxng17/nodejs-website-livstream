FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY source /usr/src/app/source
COPY app_sever.js ./
COPY micro_services /usr/src/app/micro_services
COPY .env ./
CMD ["npm","start"]