FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm ci && apk add --no-cache curl
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
USER node
CMD ["node", "dist/server.js"]