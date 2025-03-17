FROM eclipse-temurin:23-jdk-alpine
WORKDIR /app

# Copia il JAR generato da Maven
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Espone la porta dell’app (8080 di default)
EXPOSE 8080

# Avvia l’app
ENTRYPOINT ["java", "-jar", "app.jar"]
