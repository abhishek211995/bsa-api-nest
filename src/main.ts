import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { AllExceptionsFilter } from "./exception/global-exception.filter";
import { Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/http-exception.filter";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Breeder")
    .setDescription("API for Breeder")
    .setVersion("1")
    .build();

  // cors options
  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);
  app.use(cookieParser());

  // exception handlers
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(8080);
}
bootstrap();
