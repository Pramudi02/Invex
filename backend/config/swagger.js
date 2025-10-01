const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '1.0.0',
      description: 'API documentation for the Inventory Management System',
      contact: {
        name: 'API Support',
        email: 'support@inventory.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Item: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Item ID'
            },
            name: {
              type: 'string',
              description: 'Item name'
            },
            description: {
              type: 'string',
              description: 'Item description'
            },
            quantity: {
              type: 'integer',
              description: 'Item quantity'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Item price'
            },
            category: {
              type: 'string',
              description: 'Item category'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username or email'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            token: {
              type: 'string',
              description: 'JWT token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: {
              type: 'string',
              description: 'Username (min 3 characters)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password (min 6 characters)'
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff'],
              description: 'User role'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            message: {
              type: 'string',
              description: 'Detailed error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
