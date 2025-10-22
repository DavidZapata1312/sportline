import { ProductService } from '../src/services/product.service.js';
import { ProductDAO } from '../src/dao/product.dao.js';

jest.mock('../src/dao/product.dao.js');

const MockedProductDAO = ProductDAO as jest.MockedClass<typeof ProductDAO>;

describe('ProductService', () => {
  let service: ProductService;
  let daoInstance: jest.Mocked<InstanceType<typeof ProductDAO>>;

  beforeEach(() => {
    MockedProductDAO.mockClear();
    service = new ProductService();
    daoInstance = (service as any).productDAO;
  });

  test('create denies duplicate code', async () => {
    daoInstance.codeExists.mockResolvedValueOnce(true as any);
    await expect(service.create({ code: 'A', name: 'P', price: 1, category: 'C', stock: 0 })).rejects.toThrow('Product code already exists');
  });

  test('create sets default stock 0', async () => {
    daoInstance.codeExists.mockResolvedValueOnce(false as any);
    const created = { id: 1, code: 'A', stock: 0 } as any;
    daoInstance.create.mockImplementation(async (d: any) => created);
    const res = await service.create({ code: 'A', name: 'P', price: 1, category: 'C' } as any);
    expect(res).toBe(created);
  });

  test('update checks code conflict', async () => {
    daoInstance.codeExists.mockResolvedValueOnce(true as any);
    await expect(service.update(1, { code: 'X' })).rejects.toThrow('Product code already exists');
  });
});
