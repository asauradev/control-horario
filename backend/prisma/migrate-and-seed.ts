import { execSync } from 'child_process';

async function main() {
  try {
    console.log('📦 Ejecutando migración...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    console.log('🌱 Ejecutando seed...');
    execSync('npm run seed', { stdio: 'inherit' });

    console.log('✅ Migración y seed completados correctamente.');
  } catch (error) {
    console.error('❌ Error durante migración o seed:', error);
    process.exit(1);
  }
}

main();
