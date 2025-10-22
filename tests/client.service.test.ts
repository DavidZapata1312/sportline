import { ClientService } from '../src/services/client.service.js';
import { ClientDAO } from '../src/dao/client.dao.js';

jest.mock('../src/dao/client.dao.js');

const MockedClientDAO = ClientDAO as jest.MockedClass<typeof ClientDAO>;

describe('ClientService', () => {
  let service: ClientService;
  let daoInstance: jest.Mocked<InstanceType<typeof ClientDAO>>;

  beforeEach(() => {
    MockedClientDAO.mockClear();
    service = new ClientService();
    daoInstance = (service as any).clientDAO;
  });

  test('create denies duplicate email', async () => {
    daoInstance.emailExists.mockResolvedValueOnce(true as any);
    await expect(service.create({ name: 'A', email: 'a@b.com' })).rejects.toThrow('Email already exists');
  });

  test('create passes to DAO', async () => {
    daoInstance.emailExists.mockResolvedValueOnce(false as any);
    const created = { id: 1, name: 'A', email: 'a@b.com' } as any;
    daoInstance.create.mockResolvedValueOnce(created);
    await expect(service.create({ name: 'A', email: 'a@b.com' })).resolves.toBe(created);
  });

  test('update checks email conflict', async () => {
    daoInstance.emailExists.mockResolvedValueOnce(true as any);
    await expect(service.update(1, { email: 'x@x.com' })).rejects.toThrow('Email already exists');
  });
});
