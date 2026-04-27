FROM node:22.12.0-alpine

WORKDIR /app

COPY . /app

EXPOSE 3000

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]