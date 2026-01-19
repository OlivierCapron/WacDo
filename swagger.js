const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options =
{
    definition: {
        openapi: "3.0.0",
        info:
        {
            title: "WacDo API",
            version: "1.0.0",
            description: " Documentation de l’API WacDo",
        },
        servers: [
            { url: 'http://localhost:5000',url: 'http://127.0.0.1:5000', url: 'https://formation.fleyetrap.com'  }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            { bearerAuth: [] }
        ],
    },
    apis: ["./routes/*.js"],

};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
