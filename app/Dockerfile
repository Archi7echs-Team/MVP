# Build step
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime step
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app /app
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host"]
