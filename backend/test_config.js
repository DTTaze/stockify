const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { ConfigService } = require('@nestjs/config');

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  console.log("ML_SERVICE_URL from configService:", config.get('app.mlServiceUrl'));
  console.log("ML_SERVICE_URL from process.env:", process.env['app.mlServiceUrl'] || process.env['ML_SERVICE_URL']);
  await app.close();
}
test().catch(console.error);
