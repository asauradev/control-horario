import { Test, TestingModule } from '@nestjs/testing';
import { WorklogController } from './worklog.controller';
import { WorklogService } from './worklog.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('WorklogController', () => {
  let controller: WorklogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorklogController],
      providers: [
        WorklogService,
        {
          provide: PrismaService,
          useValue: {
            workLog: {
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ email: 'test@example.com' }),
          },
        },
        {
          provide: JwtAuthGuard,
          useClass: JwtAuthGuard, // O puedes usar useValue: {} si no necesitas testearlo
        },
      ],
    }).compile();

    controller = module.get<WorklogController>(WorklogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});



