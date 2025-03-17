# FASE 1: Compilazione (eseguita nel container "build", non qui!)
FROM maven:3.9.9-eclipse-temurin-23-alpine AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# FASE 2: Immagine finale di runtime (solo Java JDK)
FROM eclipse-temurin:23-jdk-alpine
WORKDIR /app

# Copiamo SOLO il JAR già costruito
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
