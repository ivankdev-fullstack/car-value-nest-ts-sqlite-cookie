import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import {
  CreateReportDto,
  GetEstimateDto,
  UpdateReportDto,
} from './entity/report.dto';
import { Report } from './entity/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  public async createEstimate(fields: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make')
      .andWhere('model = :model')
      .andWhere('lng - :lng BETWEEN -5 AND 5')
      .andWhere('lat - :lat BETWEEN -5 AND 5')
      .andWhere('year - :year BETWEEN -3 AND 3')
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ ...fields })
      .limit(3)
      .getRawOne();
  }

  public async create(data: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportRepository.create({ ...data, user });
    return this.reportRepository.save(report);
  }

  public async updateById(id: number, data: UpdateReportDto): Promise<Report> {
    const report = await this.reportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return this.reportRepository.save({ ...report, ...data });
  }
}
