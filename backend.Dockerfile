FROM maven:3.9.9-amazoncorretto-21-alpine AS build

WORKDIR /app/backend
COPY openapi.yaml /app
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend ./

RUN mvn package -DskipTests

FROM amazoncorretto:21-alpine AS runtime

WORKDIR /app/backend
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]