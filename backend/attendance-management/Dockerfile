FROM eclipse-temurin:21-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y maven

COPY . .

RUN mvn clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar"]
