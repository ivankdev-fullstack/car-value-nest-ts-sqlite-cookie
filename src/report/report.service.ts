import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto, UpdateReportDto } from './entity/report.dto';
import { Report } from './entity/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  public async updateById(id: number, data: UpdateReportDto): Promise<Report> {
    const report = await this.reportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    return this.reportRepository.save({ ...report, ...data });
  }

  public async create(data: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportRepository.create({ ...data, user });
    return this.reportRepository.save(report);
  }
}
