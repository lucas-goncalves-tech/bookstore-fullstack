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

  try {
    const { count } = await this.prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: cutoffDate } },
          { revokedAt: { not: null, lt: cutoffDate } },
        ],
      },
    });

    if (count > 0) {
      //eslint-disable-next-line
      console.log(`[CleanupExpiredSessions] ${count} sessões expiradas removidas.`);
    }
  } catch (error) {
    // P2021 = "The table {table} does not exist in the current database."
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2021"
    ) {
      //eslint-disable-next-line
      console.warn("[CleanupExpiredSessions] Tabela 'session' ainda não existe. Aguardando migrations...");
      return;
    }
    throw error;
  }
}

}
