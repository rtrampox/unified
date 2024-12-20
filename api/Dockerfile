FROM node:21-alpine AS build

RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# generate the prisma client
RUN pnpm exec prisma generate

RUN pnpm run build

FROM node:21-alpine as runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/pnpm-lock.yaml ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]