# Build stage
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/backend-1.0.0.jar app.jar

# Configurações importantes para Render
EXPOSE 5000
ENV JAVA_OPTS="-Xmx256m -Xss512k -Dserver.port=5000"

# Entrypoint simplificado
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]