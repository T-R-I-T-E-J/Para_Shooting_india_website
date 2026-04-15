import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface MintRow {
  last_sequence_number: number;
  code: string;
}

@Injectable()
export class CompetitionNumberService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Atomically increments last_sequence_number for the competition and
   * returns the new formatted competition number (e.g. "COMP-0135-001").
   *
   * Uses a single UPDATE ... RETURNING to prevent any race conditions even
   * under very high concurrent approval loads.
   */
  async mint(competitionId: number, competitionCode: string): Promise<string> {
    const result = (await this.dataSource.query(
      `UPDATE competitions
          SET last_sequence_number = last_sequence_number + 1
        WHERE id = $1
        RETURNING last_sequence_number, code`,
      [competitionId],
    )) as unknown as MintRow[];

    if (!result || result.length === 0) {
      throw new Error(`Competition ${competitionId} not found during minting`);
    }

    const seq: number = result[0].last_sequence_number;
    const code: string = result[0].code ?? competitionCode;

    const padded = String(seq).padStart(3, '0');
    return `COMP-${code}-${padded}`;
  }
}
