const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Sportline API',
    version: '1.0.0',
    description: 'API documentation for Sportline (clients, products, deliveries, auth)'
  },
  servers: [{ url: 'http://localhost:4000', description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Client: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['name', 'email']
      },
      CreateClient: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      UpdateClient: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          code: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          price: { type: 'number', format: 'float' },
          category: { type: 'string' },
          stock: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['code', 'name', 'price', 'category']
      },
      CreateProduct: {
        type: 'object',
        required: ['code', 'name', 'price', 'category'],
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          stock: { type: 'integer' }
        }
      },
      UpdateProduct: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          stock: { type: 'integer' }
        }
      },
      DeliveryItem: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer' },
          unitPrice: { type: 'number' },
          subtotal: { type: 'number' },
          product: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              code: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      },
      Delivery: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          clientId: { type: 'integer' },
          totalAmount: { type: 'number' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          items: { type: 'array', items: { $ref: '#/components/schemas/DeliveryItem' } }
        }
      },
      CreateDelivery: {
        type: 'object',
        required: ['clientId', 'items'],
        properties: {
          clientId: { type: 'integer' },
          notes: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'integer' },
                quantity: { type: 'integer', minimum: 1 }
              }
            }
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'staff'] }
        }
      }
    }
  },
  paths: {
    '/api/clients': {
      get: {
        tags: ['Clients'],
        summary: 'List clients',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'search', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: {
            message: { type: 'string' }, data: { type: 'array', items: { $ref: '#/components/schemas/Client' } }, total: { type: 'integer' }, page: { type: 'integer' }, limit: { type: 'integer' }, totalPages: { type: 'integer' }
          } } } } }
        }
      },
      post: {
        tags: ['Clients'],
        summary: 'Create client',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClient' } } } },
        responses: { 201: { description: 'Created' }, 409: { description: 'Email exists' } }
      }
    },
    '/api/clients/{id}': {
      get: {
        tags: ['Clients'], summary: 'Get client by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } }
      },
      put: {
        tags: ['Clients'], summary: 'Update client', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClient' } } } },
        responses: { 200: { description: 'OK' }, 404: { description: 'Not found' }, 409: { description: 'Email exists' } }
      },
      delete: {
        tags: ['Clients'], summary: 'Delete client', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'], summary: 'List products',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'minPrice', schema: { type: 'number' } },
          { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
          { in: 'query', name: 'inStock', schema: { type: 'boolean' } }
        ],
        responses: { 200: { description: 'OK' } }
      },
      post: {
        tags: ['Products'], summary: 'Create product',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProduct' } } } },
        responses: { 201: { description: 'Created' }, 409: { description: 'Code exists' } }
      }
    },
    '/api/products/{id}': {
      get: { tags: ['Products'], summary: 'Get product', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } } },
      put: { tags: ['Products'], summary: 'Update product', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProduct' } } } }, responses: { 200: { description: 'OK' }, 404: { description: 'Not found' }, 409: { description: 'Code exists' } } },
      delete: { tags: ['Products'], summary: 'Delete product', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } } }
    },
    '/api/products/code/{code}': {
      get: { tags: ['Products'], summary: 'Get by code', parameters: [{ in: 'path', name: 'code', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } } }
    },
    '/api/deliveries': {
      post: {
        tags: ['Deliveries'], summary: 'Create delivery (validates stock)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateDelivery' }, examples: { sample: { value: { clientId: 1, notes: 'Order 123', items: [{ productId: 10, quantity: 2 }] } } } } } },
        responses: { 201: { description: 'Created' }, 404: { description: 'Client/product not found' }, 409: { description: 'Insufficient stock' } }
      }
    },
    '/api/deliveries/client/{clientId}/history': {
      get: {
        tags: ['Deliveries'], summary: 'Client delivery history', parameters: [ { in: 'path', name: 'clientId', required: true, schema: { type: 'integer' } }, { in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'limit', schema: { type: 'integer' } } ],
        responses: { 200: { description: 'OK' } }
      }
    },
    '/api/auth/register': {
      post: { tags: ['Auth'], summary: 'Register', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } }, responses: { 201: { description: 'Created' }, 409: { description: 'Email exists' } } }
    },
    '/api/auth/login': {
      post: { tags: ['Auth'], summary: 'Login', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } }, responses: { 200: { description: 'OK' }, 400: { description: 'Invalid credentials' } } }
    },
    '/api/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Refresh tokens', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } } } }, responses: { 200: { description: 'OK' }, 403: { description: 'Invalid token' } } }
    }
  }
};

export default swaggerSpec;
