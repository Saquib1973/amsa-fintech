import { PrismaClient, SettingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.config.deleteMany();

  // Create test configs
  const testConfigs = [
    {
      key: 'MAINTENANCE_MODE',
      value: 'false',
      type: SettingType.BOOLEAN,
    },
    {
      key: 'MAX_TRANSACTION_AMOUNT',
      value: '10000',
      type: SettingType.NUMBER,
    },
    {
      key: 'SUPPORT_EMAIL',
      value: 'support@example.com',
      type: SettingType.STRING,
    },
    {
      key: 'MAINTENANCE_SCHEDULE',
      value: '2024-03-01T00:00:00Z',
      type: SettingType.DATE,
    },
    {
      key: 'API_SETTINGS',
      value: JSON.stringify({
        rateLimit: 100,
        timeout: 5000,
        endpoints: ['/api/v1', '/api/v2'],
      }),
      type: SettingType.JSON,
    },
  ];

  for (const config of testConfigs) {
    await prisma.config.create({
      data: config,
    });
  }

  console.log('Test configs created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });