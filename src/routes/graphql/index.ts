import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { query as querySchema } from './query/query.js';
import { mutation } from './query/mutation.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
      

    },
    async handler(req) {
      const { query, variables} = req.body
      const schema = new GraphQLSchema({
        query: querySchema,
        mutation: mutation
      })
      return await graphql({
        schema: schema,
        source: String(query),
        contextValue: fastify,
        variableValues: variables,
      })
    },
  });
};

export default plugin;
