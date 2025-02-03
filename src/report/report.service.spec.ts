import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import {
  CreateReportDto,
  GetEstimateDto,
  UpdateReportDto,
} from './entity/report.dto';
import { Report } from './entity/report.entity';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let reportService: ReportService;
  let reportRepository: Repository<Report>;

  const mockReportRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ price: 10000 }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockReportRepository,
        },
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
    reportRepository = module.get<Repository<Report>>(
      getRepositoryToken(Report),
    );
  });

  it('should be defined', () => {
    expect(reportService).toBeDefined();
  });

  describe('createEstimate', () => {
    it('should return an estimated price', async () => {
      const estimateData: GetEstimateDto = {
        make: 'Toyota',
        model: 'Corolla',
        lat: 40.7128,
        lng: -74.006,
        year: 2020,
        mileage: 50000,
      };

      const result = await reportService.createEstimate(estimateData);
      expect(result.price).toBe(10000);
      expect(mockReportRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new report', async () => {
      const user = new User();
      const createReportDto: CreateReportDto = {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        mileage: 30000,
        price: 15000,
        lat: 0,
        lng: 0,
      };

      const newReport = new Report();
      mockReportRepository.create.mockReturnValue(newReport);
      mockReportRepository.save.mockResolvedValue(newReport);

      const result = await reportService.create(createReportDto, user);
      expect(result).toEqual(newReport);
      expect(mockReportRepository.create).toHaveBeenCalledWith({
        ...createReportDto,
        user,
      });
      expect(mockReportRepository.save).toHaveBeenCalledWith(newReport);
    });
  });

  describe('updateById', () => {
    it('should update an existing report', async () => {
      const reportId = 1;
      const updateReportDto: UpdateReportDto = {
        price: 12000,
      };

      const existingReport = new Report();
      existingReport.id = reportId;
      existingReport.price = 10000;

      mockReportRepository.findOneBy.mockResolvedValue(existingReport);
      mockReportRepository.save.mockResolvedValue({
        ...existingReport,
        ...updateReportDto,
      });

      const result = await reportService.updateById(reportId, updateReportDto);
      expect(result.price).toBe(12000);
      expect(mockReportRepository.findOneBy).toHaveBeenCalledWith({
        id: reportId,
      });
      expect(mockReportRepository.save).toHaveBeenCalledWith({
        ...existingReport,
        ...updateReportDto,
      });
    });

    it('should throw NotFoundException if report is not found', async () => {
      const reportId = 999;
      const updateReportDto: UpdateReportDto = { price: 12000 };

      mockReportRepository.findOneBy.mockResolvedValue(null);

      await expect(
        reportService.updateById(reportId, updateReportDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
