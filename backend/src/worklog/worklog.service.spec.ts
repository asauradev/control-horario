import { Test, TestingModule } from '@nestjs/testing';
import { WorklogService } from './worklog.service';
import { PrismaService } from '../prisma.service';

describe('WorklogService', () => {
  let service: WorklogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorklogService,
        {
          provide: PrismaService,
          useValue: {
            workLog: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WorklogService>(WorklogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

