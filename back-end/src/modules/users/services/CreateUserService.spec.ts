import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user withe same email from another', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    await expect(
      createUserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
