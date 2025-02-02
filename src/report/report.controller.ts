import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { User } from 'src/user/entity/user.entity';
import {
  CreateReportDto,
  GetEstimateDto,
  ReportDto,
} from './entity/report.dto';
import { Report } from './entity/report.entity';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('estimate')
  @HttpCode(200)
  public async getEstimate(@Body() body: GetEstimateDto) {
    return this.reportService.createEstimate(body);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  public async create(
    @CurrentUser() user: User,
    @Body() body: CreateReportDto,
  ): Promise<Report> {
    return this.reportService.create(body, user);
  }

  @Patch('/approve/:id')
  @UseGuards(AdminGuard)
  public async approve(@Param('id') id: number): Promise<Report> {
    return this.reportService.updateById(id, { approved: true });
  }
}
