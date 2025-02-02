import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './entity/report.dto';
import { Report } from './entity/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  public async create(data: CreateReportDto) {
    const report = this.reportRepository.create(data);
    return this.reportRepository.save(report);
  }
}
