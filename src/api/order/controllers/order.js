const stripe = require('stripe')(process.env.STRIPE_KEY);


'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
      const { products } = ctx.request.body;
      try {
        const lineItems = await Promise.all(
          products.map(async (product) => {
            const item = await strapi
              .service("api::product.product")
              .findOne(product.id);
  
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.title,
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: product.quantity,
            };
          })
        );
