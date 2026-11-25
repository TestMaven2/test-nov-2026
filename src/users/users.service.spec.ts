import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersMapper } from './dto/users.mapper';
import { UserSaveDto } from './dto/user-save.dto';
import { UserRole } from './enums/user-role.enum';
import { EntitySaveException } from '../exceptions/types/entity-save.exception';
import { User } from './user.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';

describe('UsersService', () => {
  const SAVE_DTO: UserSaveDto = {
    email: 'user@test.com',
    password: 'UserPass1',
    name: 'User',
  };

  const SAVE_DTO_WITH_EXISTING_EMAIL: UserSaveDto = {
    email: 'admin@test.com',
    password: 'AdminPass1',
    name: 'Admin',
  };

  const ENTITY_TO_MOCK_RETURN_1: User = {
    id: 1,
    email: 'user@test.com',
    password: 'UserPass1',
    name: 'User',
    role: UserRole.CUSTOMER,
    active: true,
  };

  const ENTITY_TO_MOCK_RETURN_2: User = {
    id: 2,
    email: 'user2@test.com',
    password: 'UserPass2',
    name: 'User2',
    role: UserRole.CUSTOMER,
    active: true,
  };

  const UPDATE_DTO: UserUpdateDto = {
    newName: 'New User Name',
  };

  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersMapper,
        {
          provide: UsersRepository,
          useValue: {
            save: jest.fn(),
            findAllActive: jest.fn(),
            findById: jest.fn(),
            isEmailExists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UsersRepository);

    repository.isEmailExists.mockImplementation(
      async (email: string): Promise<boolean> => {
        return email === 'admin@test.com';
      },
    );

    repository.findAllActive.mockResolvedValue([
      ENTITY_TO_MOCK_RETURN_1,
      ENTITY_TO_MOCK_RETURN_2,
    ]);

    repository.save.mockImplementation(async (entity: User): Promise<User> => {
      if (entity.email === 'user@test.com') {
        return ENTITY_TO_MOCK_RETURN_1;
      }

      throw Error('User save error');
    });

    repository.findById.mockImplementation(
      async (id: number): Promise<User | null> => {
        if (id === 1) {
          return ENTITY_TO_MOCK_RETURN_1;
        }

        if (id === 2) {
          return ENTITY_TO_MOCK_RETURN_2;
        }

        return null;
      },
    );
  });

  describe('create', () => {
    it('should create active user and return DTO', async () => {
      const result = await service.create(SAVE_DTO);

      expect(result).toBeDefined();
      expect(result.name).toEqual(SAVE_DTO.name);
      expect(result.role).toEqual(UserRole.CUSTOMER);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.CUSTOMER, active: true }),
      );
    });

    it('should throw error if email already exists', async () => {
      const resultPromise =
        service.create(SAVE_DTO_WITH_EXISTING_EMAIL);

      await expect(resultPromise).rejects.toThrow('already exists');
      await expect(resultPromise).rejects.toBeInstanceOf(EntitySaveException);
    });
  });

  describe('getAllActiveUsers', () => {
    it('should return list of user DTOs', async () => {
      const result = await service.getAllActiveUsers();

      expect(result).toBeDefined();
      expect(result.length).toEqual(2);

      const dto1 = result[0];
      expect(dto1).toBeDefined();
      expect(dto1.id).toEqual(ENTITY_TO_MOCK_RETURN_1.id);
      expect(dto1.name).toEqual(ENTITY_TO_MOCK_RETURN_1.name);
      expect(dto1.role).toEqual(ENTITY_TO_MOCK_RETURN_1.role);

      const dto2 = result[1];
      expect(dto2).toBeDefined();
      expect(dto2.id).toEqual(ENTITY_TO_MOCK_RETURN_2.id);
      expect(dto2.name).toEqual(ENTITY_TO_MOCK_RETURN_2.name);
      expect(dto2.role).toEqual(ENTITY_TO_MOCK_RETURN_2.role);
    });
  });

  describe('update', () => {
    it('should update user name', async () => {
      const idToUpdate = 1;
      await service.update(idToUpdate, UPDATE_DTO);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: idToUpdate,
          name: UPDATE_DTO.newName,
        }),
      );
    });

    it('should throw exception when user is not found', async () => {
      const resultPromise = service.update(1000, UPDATE_DTO);

      await expect(resultPromise).rejects.toThrow('not found');
      await expect(resultPromise).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });
});
