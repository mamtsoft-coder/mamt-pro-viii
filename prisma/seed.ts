import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@mamt.local', role: 'Admin' }
  });

  const asset = await prisma.asset.create({
    data: {
      assetNo: 'EXC-001',
      assetType: 'Excavator',
      assetClass: 'Heavy Equipment',
      manufacturer: 'Caterpillar',
      model: '330 GC',
      serialNo: 'CAT330-88921',
      smuUom: 'hours',
      startUsage: 0,
      annualUsage: 2200,
      criticality: 'High',
      fleet: 'Fleet-A',
      location: 'Pit Zone > North Bench > Level 3',
      commissionDate: new Date('2022-03-15'),
    }
  });

  await prisma.workOrder.create({
    data: {
      assetId: asset.id,
      title: 'Replace Hydraulic Filters & Inspect Pumps',
      dueDate: new Date('2025-12-15'),
      status: 'Planned',
      labourHours: 6.5,
      partsCost: 420.00,
      downtimeType: 'Planned'
    }
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
