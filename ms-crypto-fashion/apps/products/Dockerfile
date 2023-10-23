# FROM node:alpine As development
FROM node:18-alpine  As development
# RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
# COPY --chown=node:node package*.json ./
RUN npm install -g npm@10.2.0
# RUN npm install -g npm@10.0.0
RUN npm install -g @nestjs/cli


# USER node
RUN npm install
# RUN npm ci

COPY . .
# COPY --chown=node:node . .

# COPY --chown=node:node . .
# add new

RUN npm run build products

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/products/main"]


