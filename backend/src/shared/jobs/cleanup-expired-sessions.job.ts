import { inject, injectable } from "tsyringe";
import { PrismaDB } from "../../database/prisma";

const SIX_HOURS = 6 * 60 * 60 * 1000;
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class CleanupExpiredSessionsJob {
  private readonly ttl = SIX_HOURS;

  constructor(@inject(PrismaDB) private readonly prisma: PrismaDB) {}

  start() {
    void this.execute();
    setInterval(() => {
      void this.execute();
    }, this.ttl).unref();
  }

  private async execute() {
    const cutoffDate = new Date(Date.now() - GRACE_PERIOD_MS);

    const { count } = await this.prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: cutoffDate } },
          {
            revokedAt: { not: null, lt: cutoffDate },
          },
        ],
      },
    });

    if (count > 0) {
      //eslint-disable-next-line
      console.log(
        `[CleanupExpiredSessions] ${count} sessões expiradas removidas.`,
      );
    }
  }
}
