import { Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/auth/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';
import { MarkFailedDto } from './dto/mark-failed.dto';
import { Response } from 'express';

import { CreatePaymentUseCase } from './use-cases/create-payment.usecase';
import { MarkPaymentPaidUseCase } from './use-cases/mark-payment-paid.usecase';
import { MarkPaymentFailedUseCase } from './use-cases/mark-payment-failed.usecase';
import { GetPaymentByIdUseCase } from './use-cases/get-payment-by-id.usecase';
import { GetPaymentBySessionUseCase } from './use-cases/get-payment-by-session.usecase';
import { ListPaymentsUseCase } from './use-cases/list-payments.usecase';
import { InitFlouciPaymentDto } from './dto/init-flouci-payment.dto';
import { InitFlouciPaymentUseCase } from './use-cases/init-flouci-payment.usecase';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createUC: CreatePaymentUseCase,
    private readonly markPaidUC: MarkPaymentPaidUseCase,
    private readonly markFailedUC: MarkPaymentFailedUseCase,
    private readonly getByIdUC: GetPaymentByIdUseCase,
    private readonly getBySessionUC: GetPaymentBySessionUseCase,
    private readonly listUC: ListPaymentsUseCase,
    private readonly initFlouciUC: InitFlouciPaymentUseCase,
  ) { }


  @Get('redirect/success')
  @ApiOperation({ summary: 'Flouci success redirect → deep link' })
  @ApiQuery({ name: 'paymentId', example: 'uuid-payment-id' })
  successRedirect(@Query('paymentId') paymentId: string, @Res() res: Response) {

    console.log('✅ NestJS received success redirect:', paymentId);

    return res.redirect(`tunipark://payment/success?paymentId=${paymentId}`);
  }

  @Get('redirect/fail')
  @ApiOperation({ summary: 'Flouci fail redirect → deep link' })
  @ApiQuery({ name: 'paymentId', example: 'uuid-payment-id' })
  failRedirect(@Query('paymentId') paymentId: string, @Res() res: Response) {
    return res.redirect(`tunipark://payment/fail?paymentId=${paymentId}`);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create/init a payment (PENDING)' })
  create(@Body() dto: CreatePaymentDto) {
    return this.createUC.execute(dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'List all payments (non-archived)' })
  list() {
    return this.listUC.execute();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get payment by id' })
  @ApiParam({ name: 'id', example: 'uuid-payment-id' })
  getById(@Param('id') id: string) {
    return this.getByIdUC.execute(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('by-session/:sessionId')
  @ApiOperation({ summary: 'Get payment by sessionId' })
  @ApiParam({ name: 'sessionId', example: 'uuid-session-id' })
  getBySession(@Param('sessionId') sessionId: string) {
    return this.getBySessionUC.execute(sessionId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch(':id/paid')
  @ApiOperation({ summary: 'Mark payment as PAID' })
  @ApiParam({ name: 'id', example: 'uuid-payment-id' })
  markPaid(@Param('id') id: string, @Body() dto: MarkPaidDto) {
    return this.markPaidUC.execute(id, dto.providerReference);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch(':id/failed')
  @ApiOperation({ summary: 'Mark payment as FAILED' })
  @ApiParam({ name: 'id', example: 'uuid-payment-id' })
  markFailed(@Param('id') id: string, @Body() dto: MarkFailedDto) {
    return this.markFailedUC.execute(id, dto.providerReference);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('init/flouci')
  @ApiOperation({ summary: 'Init Flouci payment (mobile gets payLink)' })
  initFlouci(@Body() dto: InitFlouciPaymentDto) {
    return this.initFlouciUC.execute(dto.sessionId, dto.amount);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get payment status by id' })
  @ApiParam({ name: 'id', example: 'uuid-payment-id' })
  get(@Param('id') id: string) {
    return this.getByIdUC.execute(id);
  }
}
