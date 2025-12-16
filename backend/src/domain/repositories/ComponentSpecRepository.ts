import type { Repository } from 'typeorm'
import { ComponentSpec } from '../entities/ComponentSpec'
import { dataSource } from '../../infrastructure/database/data-source'

export class ComponentSpecRepository {
  private repo: Repository<ComponentSpec>

  constructor() {
    this.repo = dataSource.getRepository(ComponentSpec)
  }

  listByDesignFile(designFileId: string): Promise<ComponentSpec[]> {
    return this.repo.find({
      where: { designFile: { id: designFileId } },
      relations: { designFile: true }
    })
  }

  save(spec: ComponentSpec): Promise<ComponentSpec> {
    return this.repo.save(spec)
  }
}

