FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV PORT 29005
EXPOSE 29005

CMD ["npm", "start"]
