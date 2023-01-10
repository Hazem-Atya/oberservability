FROM node:lts-alpine
WORKDIR /app

COPY package* .

RUN npm install

COPY . .

CMD ["node", "fact.js"]  