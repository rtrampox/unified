FROM node:21-alpine AS build

RUN corepack enable pnpm

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run generate-api
RUN pnpm build

FROM node:21-alpine AS runtime

COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build"]