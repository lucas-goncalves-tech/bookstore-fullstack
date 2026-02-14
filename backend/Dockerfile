FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci && apk add --no-cache curl
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .

FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS prod
ENV NODE_ENV=production
RUN npm run build
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
USER node
CMD ["npm", "run", "start"]