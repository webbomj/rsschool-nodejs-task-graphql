import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType, GraphQLFloat, GraphQLString, GraphQLInt , GraphQLBoolean, GraphQLID} from "graphql";

export const user = new GraphQLObjectType({
    name: "User",
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
    },
  });

export const memberResponse = new GraphQLObjectType({
    name: "MemberTypes",
    fields: {
        id: {type: GraphQLString},
        discount: {type: GraphQLFloat},
        postsLimitPerMonth: {type: GraphQLInt},
    }
})

export const profiles = new GraphQLObjectType({
    name: "Profiles",
    fields: {
        id: {type: GraphQLID},
        isMale: {type: GraphQLBoolean},
        yearOfBirth: {type: GraphQLInt},
        userId: {type: GraphQLID},
        memberTypeId: {type: GraphQLString}
    }
})

export const posts = new GraphQLObjectType({
    name: "Posts",
    fields: {
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        content: {type: GraphQLString},
        authorId: {type: GraphQLID},
    }
})

export const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //get member-types
        memberTypes: {
            type: new GraphQLList(memberResponse),
            resolve: async (_, _2, ctx: FastifyInstance) =>  await ctx?.prisma?.memberType.findMany()
        },
        //get profiles
        profiles: {
            type: new GraphQLList(profiles),
            resolve: async (_, _2, ctx: FastifyInstance) => await ctx?.prisma?.profile?.findMany()
        },
        //get posts
        posts: {
            type: new GraphQLList(posts),
            resolve: async (_, _2, ctx: FastifyInstance) => await ctx?.prisma?.post?.findMany()
        },
        //get users
        users: {
            type: new GraphQLList(user),
            resolve: async (_, _2, ctx: FastifyInstance) => await ctx?.prisma?.user?.findMany()
        },
        //get member-types by id
        memberType : {
            type: memberResponse,
            args: { id: { type: GraphQLString} },
            resolve: async (_, args, ctx: FastifyInstance) => {
                const memberType = await ctx.prisma.memberType.findUnique({
                    where: {
                        id: args.id
                    }
                })
                if (!memberType) {
                    throw ctx.httpErrors.notFound()
                }
                return memberType
            }
        },
        //get profile by id
        profile: {
            type: profiles,
            args: { id: { type: GraphQLString} },
            resolve: async (_, args, ctx: FastifyInstance) => {
                const profile = await ctx.prisma.profile.findUnique({
                    where: {
                        id: args.id
                    }
                })

                if (!profile) {
                    throw ctx.httpErrors.notFound()
                }
                return profile
            }
            
        },
        //get post by id
        post: {
            type: posts,
            args: { id: { type: GraphQLString} },
            resolve: async (_, args, ctx: FastifyInstance) => {
                const post = await ctx.prisma.post.findUnique({
                    where: {
                        id: args.id
                    }
                })
                if (!post) {
                    throw ctx.httpErrors.notFound()
                }
                return post
            }
        },
        //get user by id
        user: {
            type: user,
            args: { id: { type: GraphQLString} },
            resolve: async (_, args, ctx: FastifyInstance) => {
                const user  = await ctx.prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
            if (!user) {
                throw ctx.httpErrors.notFound()
            } 
            return user
            }
        }
    }
})

