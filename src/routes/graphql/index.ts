import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, validate, parse } from 'graphql';
import { query as querySchema } from './query/query.js';
import { mutation } from './query/mutation.js';
import depthLimit from 'graphql-depth-limit'

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
    
    
    async handler(req, reply) {
      const { query, variables} = req.body
      const schema = new GraphQLSchema({
        query: querySchema,
        mutation: mutation
      })

      const errors = validate(schema, parse(String(query)), [depthLimit(5)])
      if (errors.length > 0) {
				reply.send({ data: null, errors: errors });
				return;
			}

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
