import { Repository } from 'typeorm'
import { DesignToken } from '../entities/DesignToken'
import { dataSource } from '../../infrastructure/database/data-source'

export class DesignTokenRepository {
  private repo: Repository<DesignToken>

  constructor() {
    this.repo = dataSource.getRepository(DesignToken)
  }

  listByDesignFile(designFileId: string): Promise<DesignToken[]> {
    return this.repo.find({
      where: { designFile: { id: designFileId } },
      relations: { designFile: true }
    })
  }

  save(token: DesignToken): Promise<DesignToken> {
    return this.repo.save(token)
  }
}

