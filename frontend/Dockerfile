FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install vite --save-dev

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]