import { Prisma } from '../config/database.js';

export type PrismaPartWithSpecs = Prisma.PartGetPayload<{
  include: {
    PartSpec: {
      include: {
        SpecColumn: true
      }
    }
  }
}>;

export const mapPartToResponse = (part: PrismaPartWithSpecs) => {
  const specs = part.PartSpec
    .filter((spec: any) => spec.associated)
    .map((spec: any) => ({
      column: spec.SpecColumn.name,
      value: spec.value !== null ? spec.value : null
    }));

  return {
    partNo: part.partNo,
    datasheetUrl: part.datasheetUrl,
    specs,
  };
};

export const mapPartsToResponse = (parts: PrismaPartWithSpecs[]) => {
  return parts.map(mapPartToResponse);
};
