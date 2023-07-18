# FROM node:18
FROM node:18.16.1

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install


COPY . ./

RUN npx prisma generate

EXPOSE 4000
CMD [ "yarn", "start" ]