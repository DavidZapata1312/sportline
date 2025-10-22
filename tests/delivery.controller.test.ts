import { DeliveryController } from '../src/controllers/delivery.controller.js';

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let service: any;

  beforeEach(() => {
    controller = new DeliveryController();
    (controller as any).deliveryService = service = {
      create: jest.fn(),
      getClientHistory: jest.fn(),
    };
  });

  test('create maps stock error to 409', async () => {
    const req: any = { body: { clientId: 1, items: [] } };
    const res = mockRes();
    service.create.mockRejectedValueOnce(new Error('Insufficient stock for product X'));
    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('clientHistory ok', async () => {
    const req: any = { params: { clientId: '1' }, query: {} };
    const res = mockRes();
    service.getClientHistory.mockResolvedValueOnce({ deliveries: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    await controller.clientHistory(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
  });
});
