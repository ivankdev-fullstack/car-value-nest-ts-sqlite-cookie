import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { User } from 'src/user/entity/user.entity';
import { CreateReportDto, ReportDto } from './entity/report.dto';
import { Report } from './entity/report.entity';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  public async createReport(
    @CurrentUser() user: User,
    @Body() body: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.create(body, user);
  }
}
