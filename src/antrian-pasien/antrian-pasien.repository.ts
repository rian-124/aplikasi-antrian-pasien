import { PrismaService } from 'src/common/prisma.service';
import { RecapAntrianPasiensRawDto } from './dtos/recap-antrian.dto';
import { Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/model/user.model';

@Injectable()
export class AntrianPasienRepository {
  constructor(private prisma: PrismaService) {}

  async getRecapAntrianPasienRepository(
    req: AuthenticatedRequest,
  ): Promise<RecapAntrianPasiensRawDto[]> {
    return this.prisma.$queryRaw<RecapAntrianPasiensRawDto[]>`
            SELECT user_id,
            COUNT(pasien_id) AS total,
            DATE_TRUNC('day', "created_At") AS perday,
            DATE_TRUNC('month', "created_At") AS permonth,
            DATE_TRUNC('year', "created_At") AS peryear
            FROM antrian_pasiens
            WHERE user_id = ${req.user.sub}
            GROUP BY user_id, perday, permonth, peryear
            ORDER BY perday DESC;
        `;
  }
}
