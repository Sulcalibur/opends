import { Repository } from 'typeorm'
import { DesignFile } from '../entities/DesignFile'
import { dataSource } from '../../infrastructure/database/data-source'

export class DesignFileRepository {
  private repo: Repository<DesignFile>

  constructor() {
    this.repo = dataSource.getRepository(DesignFile)
  }

  list(): Promise<DesignFile[]> {
    return this.repo.find({ relations: { components: true, tokens: true } })
  }

  getById(id: string): Promise<DesignFile | null> {
    return this.repo.findOne({ where: { id }, relations: { components: true, tokens: true } })
  }

  save(file: DesignFile): Promise<DesignFile> {
    return this.repo.save(file)
  }
}

