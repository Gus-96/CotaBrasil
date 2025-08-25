# Use a imagem oficial do OpenJDK 21
FROM eclipse-temurin:21-jdk-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie primeiro o pom.xml para aproveitar cache do Maven
COPY pom.xml .

# Copie o código fonte
COPY src ./src

# Instale o Maven e construa a aplicação
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Exponha a porta que sua aplicação usa
EXPOSE 5000

# Comando para executar a aplicação
ENTRYPOINT ["java", "--enable-native-access=ALL-UNNAMED", "-jar", "target/backend-1.0.0.jar"]