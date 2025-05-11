FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

RUN apt-get update && apt-get install -y wait-for-it

CMD ["sh", "-c", "wait-for-it mongo:27017 -- npm run seed:brands && npm run seed:models && npm run seed:users && npm run seed:drivers && npm run dev"]
