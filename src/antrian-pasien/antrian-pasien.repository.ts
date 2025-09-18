import { PrismaService } from 'src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/model/user.model';
import {
  RecapAntrianPasiensPerdayRawDto,
  RecapAntrianPasiensPermonthRawDto,
  RecapAntrianPasiensPeryearRawDto,
} from './dtos/recap-antrian.dto';

@Injectable()
export class AntrianPasienRepository {
  constructor(private prisma: PrismaService) {}

  async getRecapAntrianPasienRepository(req: AuthenticatedRequest) {
    const perday = await this.prisma.$queryRaw<
      RecapAntrianPasiensPerdayRawDto[]
    >`
  SELECT ap.user_id,
         COUNT(ap.pasien_id) AS total,
         DATE_TRUNC('day', ap."update_At") AS perday
  FROM antrian_pasiens ap
  JOIN status_antrians sa ON ap.status_antrian_id = sa.id
  WHERE ap.user_id = ${req.user.sub}
    AND (sa.status = 'COMPLETE' OR sa.status = 'CANCELED')
  GROUP BY ap.user_id, perday
  ORDER BY perday DESC;
`;

    const permonth = await this.prisma.$queryRaw<
      RecapAntrianPasiensPermonthRawDto[]
    >`
  SELECT ap.user_id,
         COUNT(ap.pasien_id) AS total,
         DATE_TRUNC('month', ap."update_At") AS permonth
  FROM antrian_pasiens ap
  JOIN status_antrians sa ON ap.status_antrian_id = sa.id
  WHERE ap.user_id = ${req.user.sub}
    AND (sa.status = 'COMPLETE' OR sa.status = 'CANCELED')
  GROUP BY ap.user_id, permonth
  ORDER BY permonth DESC;
`;

    const peryear = await this.prisma.$queryRaw<
      RecapAntrianPasiensPeryearRawDto[]
    >`
  SELECT ap.user_id,
         COUNT(ap.pasien_id) AS total,
         DATE_TRUNC('year', ap."update_At") AS peryear
  FROM antrian_pasiens ap
  JOIN status_antrians sa ON ap.status_antrian_id = sa.id
  WHERE ap.user_id = ${req.user.sub}
    AND (sa.status = 'COMPLETE' OR sa.status = 'CANCELED')
  GROUP BY ap.user_id, peryear
  ORDER BY peryear DESC;
`;

    return { perday, permonth, peryear };
  }
}
