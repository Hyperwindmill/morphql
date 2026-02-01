import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { DocumentationService } from './documentation.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MorphQL API')
    .setDescription('Stateless Transformation Engine')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Inject staged query documentation
  const docService = app.get(DocumentationService);
  const fragments = docService.getDocFragments();
  for (const fragment of fragments) {
    if (fragment.paths) {
      Object.assign(document.paths, fragment.paths);
    }
    if (fragment.components?.schemas) {
      document.components = document.components || {};
      document.components.schemas = document.components.schemas || {};
      Object.assign(document.components.schemas, fragment.components.schemas);
    }
  }

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
