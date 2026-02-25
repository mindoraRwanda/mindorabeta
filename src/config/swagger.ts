import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mindora API',
      version: '1.0.0',
      description: 'Mental health platform API - connecting patients with therapists',
      contact: {
        name: 'Mindora Team',
        email: 'support@mindora.com',
      },
    },
    servers: [
      {
        url: (process.env.API_URL || 'http://localhost:5000') + '/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Therapists', description: 'Therapist operations' },
      { name: 'Appointments', description: 'Appointment booking and management' },
      { name: 'Exercises', description: 'Mental health exercises' },
      { name: 'Community', description: 'Community posts and interactions' },
      { name: 'Mood', description: 'Mood logging and analytics' },
      { name: 'Monitoring', description: 'Patient monitoring' },
      { name: 'Messages', description: 'Real-time messaging' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'Resources', description: 'Mental health resources' },
      { name: 'Reviews', description: 'Therapist reviews' },
      { name: 'Admin', description: 'Admin operations' },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
