# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
RUN npm ci
COPY src ./src
RUN npm run build

# Run stage
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
# Copy compiled app from builder
COPY --from=builder /app/dist ./dist
# Copy the generated Prisma client engine from builder (avoids MODULE_NOT_FOUND)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Prisma engine requires openssl
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
