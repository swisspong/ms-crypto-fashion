# FROM node:alpine As development
FROM node:18-alpine  As development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g npm@10.2.0
# RUN npm install -g npm@10.0.0
RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build carts

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/carts/main"]


