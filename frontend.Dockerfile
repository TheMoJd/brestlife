FROM node:23.7.0-alpine3.21 AS build

WORKDIR /app/frontend

COPY ./openapi.yaml /app
COPY ./frontend /app/frontend

RUN npm install --frozen-lockfile

RUN --mount=type=secret,id=vite_api_url,env=VITE_API_URL \
    --mount=type=secret,id=vite_google_maps_api_key,env=VITE_GOOGLE_MAPS_API_KEY \
    echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY" >> .env

RUN npm run build

FROM node:23.7.0-alpine3.21 AS runtime

WORKDIR /app/frontend
COPY --from=build /app/frontend/dist dist

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]