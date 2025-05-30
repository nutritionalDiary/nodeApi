FROM node:22.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
