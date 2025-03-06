FROM maven:3.9.9-amazoncorretto-21-alpine AS build

WORKDIR /app/backend
COPY openapi.yaml /app
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend ./
RUN mvn package -DskipTests

FROM amazoncorretto:21-alpine AS runtime

RUN --mount=type=secret,id=datasource,env=SPRING_DATASOURCE \
    --mount=type=secret,id=datasource_port,env=SPRING_DATASOURCE_PORT \
    --mount=type=secret,id=datasource_db,env=SPRING_DATASOURCE_DB \
    --mount=type=secret,id=datasource_username,env=SPRING_DATASOURCE_USERNAME \
    --mount=type=secret,id=datasource_password,env=SPRING_DATASOURCE_PASSWORD \

WORKDIR /app/backend
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]