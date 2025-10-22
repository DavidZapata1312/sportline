import { DeliveryService } from '../src/services/delivery.service.js';
import { DeliveryDAO } from '../src/dao/delivery.dao.js';

jest.mock('../src/dao/delivery.dao.js');

const MockedDeliveryDAO = DeliveryDAO as jest.MockedClass<typeof DeliveryDAO>;

describe('DeliveryService', () => {
  let service: DeliveryService;
  let daoInstance: jest.Mocked<InstanceType<typeof DeliveryDAO>>;

  beforeEach(() => {
    MockedDeliveryDAO.mockClear();
    service = new DeliveryService();
    daoInstance = (service as any).deliveryDAO;
  });

  test('create forwards to DAO', async () => {
    const dto: any = { clientId: 1, items: [{ productId: 2, quantity: 1 }] };
    const created: any = { id: 10, clientId: 1 };
    daoInstance.createDelivery.mockResolvedValueOnce(created);
    await expect(service.create(dto)).resolves.toBe(created);
  });

  test('history forwards to DAO', async () => {
    const resp: any = { deliveries: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    daoInstance.getClientHistory.mockResolvedValueOnce(resp);
    await expect(service.getClientHistory(1, 1, 10)).resolves.toBe(resp);
  });
});
