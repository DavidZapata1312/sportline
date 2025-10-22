import { ClientController } from '../src/controllers/client.controller.js';

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('ClientController', () => {
  let controller: ClientController;
  let service: any;

  beforeEach(() => {
    controller = new ClientController();
    // Replace service with stub
    service = (controller as any).clientService ?? {};
    // If service is not a field, mimic methods via spy
    (controller as any).clientService = service = {
      list: jest.fn(),
      getById: jest.fn(),
    };
  });

  test('getById 404', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();
    service.getById.mockResolvedValueOnce(null);
    await controller.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('list ok', async () => {
    const req: any = { query: {} };
    const res = mockRes();
    service.list.mockResolvedValueOnce({ clients: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    await controller.list(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), data: [] }));
  });
});
