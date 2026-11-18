const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopSphere E-Commerce API',
      version: '1.0.0',
      description:
        'RESTful API for ShopSphere Full-Stack E-Commerce Mobile Application (Auth, Profile, Products, Cart, Wishlist, Orders).'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            avatar: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            image: { type: 'string' },
            stock: { type: 'number' },
            rating: { type: 'number' },
            numReviews: { type: 'number' },
            featured: { type: 'boolean' }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            product: { $ref: '#/components/schemas/Product' },
            quantity: { type: 'number' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
