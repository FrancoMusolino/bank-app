FROM node:alpine    

WORKDIR /server

COPY ./server/package*.json ./
COPY ./server/tsconfig.json ./
COPY ./server/jest.config.ts ./

COPY ./server/src ./src
COPY ./server/.env ./

RUN npm install -g typescript
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]