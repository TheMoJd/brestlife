FROM node:23.7.0-alpine3.21 AS build

WORKDIR /app/frontend
COPY openapi.yaml /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --frozen-lockfile

COPY frontend ./
RUN rm .env

RUN ls -la

RUN npm run build  # Génère le build de production

FROM node:23.7.0-alpine3.21 AS runtime

WORKDIR /app/frontend
COPY --from=build /app/frontend/dist dist

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]