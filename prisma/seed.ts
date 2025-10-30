import { Seeder } from './seeds';

async function main() {
  const seeder = new Seeder();

  await seeder.run();
  await seeder.close();
}

main().catch((e) => {
  console.error(`Error to seeding data ${e}`);
});
