FROM node:alpine    

WORKDIR /app

COPY ./package*.json .
COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]