########################################
# Stage 1: Development build
########################################
FROM node:lts-alpine as development

WORKDIR /app
EXPOSE 3000
RUN chown -R node /app
USER node

COPY package.json package-lock.json ./

ENV NODE_ENV=development
RUN npm ci --silent

COPY . .

RUN npm run build

CMD ["npm", "start:dev"]

########################################
# Stage 2: Release Build
########################################

FROM node:lts-alpine as release

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY package.json package-lock.json ./

RUN npm ci --only=production

CMD ["npm", "start"]
