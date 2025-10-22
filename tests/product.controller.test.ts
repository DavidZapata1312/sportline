import { ProductController } from '../src/controllers/product.controller.js';

function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('ProductController', () => {
  let controller: ProductController;
  let service: any;

  beforeEach(() => {
    controller = new ProductController();
    // Inject service stub
    (controller as any).productService = service = {
      getById: jest.fn(),
      getByCode: jest.fn(),
      list: jest.fn(),
    };
  });

  test('getByCode 404', async () => {
    const req: any = { params: { code: 'X' } };
    const res = mockRes();
    service.getByCode.mockResolvedValueOnce(null);
    await controller.getByCode(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getById ok', async () => {
    const req: any = { params: { id: '1' } };
    const res = mockRes();
    service.getById.mockResolvedValueOnce({ id: 1 });
    await controller.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { id: 1 } }));
  });
});
