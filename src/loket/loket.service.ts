import { Injectable, NotFoundException } from '@nestjs/common';
import { Lokets } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { AuthenticatedRequest } from 'src/model/user.model';

@Injectable()
export class LoketService {
  constructor(private prismaService: PrismaService) {}

  async getAllLoketsService(request: AuthenticatedRequest): Promise<Lokets[]> {
    const outlet = await this.prismaService.outlets.findFirst({
      where: {
        nama_outlet: request.user.outlet,
      },
    });

    if (!outlet) {
      throw new NotFoundException('Tidak dapat menemukan outlet');
    }

    const lokets = await this.prismaService.lokets.findMany({
      orderBy: {
        id: 'asc',
      },
      where: {
        outlet_id: outlet.id,
        OR: [
          { users: null },
          {
            users: {
              id: request.user.sub,
            },
          },
        ],
      },
    });

    return lokets;
  }
}
