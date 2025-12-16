import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import type { Repository } from 'typeorm'
import { DesignFile } from '../entities/DesignFile'
import { DesignFileRepository } from './DesignFileRepository'
import { dataSource } from '../../infrastructure/database/data-source'

describe('DesignFileRepository', () => {
  let mockRepo: Repository<DesignFile>
  let repository: DesignFileRepository

  beforeAll(() => {
    // Mock the dataSource.getRepository method before any tests run
    vi.mock('../../infrastructure/database/data-source', () => ({
      dataSource: {
        getRepository: vi.fn()
      }
    }))
  })

  beforeEach(() => {
    mockRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      save: vi.fn()
    } as unknown as Repository<DesignFile>

    vi.mocked(dataSource.getRepository).mockReturnValue(mockRepo)
    repository = new DesignFileRepository()
  })

  describe('list', () => {
    it('should return all design files with relations', async () => {
      const mockFiles = [
        { id: '1', name: 'File 1', source: 'penpot' },
        { id: '2', name: 'File 2', source: 'figma' }
      ]
      mockRepo.find = vi.fn().mockResolvedValue(mockFiles)

      const result = await repository.list()

      expect(mockRepo.find).toHaveBeenCalledWith({
        relations: { components: true, tokens: true }
      })
      expect(result).toEqual(mockFiles)
    })
  })

  describe('getById', () => {
    it('should return design file by id with relations', async () => {
      const mockFile = { id: '123', name: 'Test File', source: 'penpot' }
      mockRepo.findOne = vi.fn().mockResolvedValue(mockFile)

      const result = await repository.getById('123')

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: { components: true, tokens: true }
      })
      expect(result).toEqual(mockFile)
    })

    it('should return null when file not found', async () => {
      mockRepo.findOne = vi.fn().mockResolvedValue(null)

      const result = await repository.getById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('save', () => {
    it('should save a design file', async () => {
      const file = new DesignFile()
      file.name = 'New File'
      file.source = 'penpot'

      const savedFile = { ...file, id: '123', createdAt: new Date(), updatedAt: new Date() }
      mockRepo.save = vi.fn().mockResolvedValue(savedFile)

      const result = await repository.save(file)

      expect(mockRepo.save).toHaveBeenCalledWith(file)
      expect(result).toEqual(savedFile)
    })
  })
})