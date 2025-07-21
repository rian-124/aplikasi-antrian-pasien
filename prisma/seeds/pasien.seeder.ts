// import { PrismaService } from 'src/common/prisma.service';
// import { ValidationService } from 'src/common/validation.service';
// import { Jenis } from 'src/model/pasiens.model';
// import { PasiensService } from 'src/pasiens/pasiens.service';
// import { Logger } from 'winston';

// export class PasienSeeder {
//   private pasienService: PasiensService;

//   constructor(
//     prismaService: PrismaService,
//     validationService: ValidationService,
//     logger: Logger,
//   ) {
//     this.pasienService = new PasiensService(
//       prismaService,
//       validationService,
//       logger,
//     );
//   }

//   async seed() {
//     const dataUmum = {
//       jenis: Jenis.UMUM,
//     };
//     const dataJaminan = {
//       jenis: Jenis.JAMINAN,
//     };

//     let totalUmum = 0;
//     let totalJaminan = 0;

//     for (totalUmum; totalUmum < 10; totalUmum++) {
//       await this.pasienService.storePasiens(dataUmum);
//     }

//     for (totalJaminan; totalJaminan < 10; totalJaminan++) {
//       await this.pasienService.storePasiens(dataJaminan);
//     }

//     const total = totalJaminan + totalUmum;

//     console.log(`Seeding pasien_Seeder (${total} records)`);
//   }
// }
