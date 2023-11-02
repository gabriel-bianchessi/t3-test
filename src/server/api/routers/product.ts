import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "../trpc"

const idValidation = (props: {
  invalid_type_error?: string | undefined;
  required_error?: string | undefined;
  description?: string | undefined;
}) => z.coerce.number({
  invalid_type_error: props.invalid_type_error ?? "ID needs to be a number",
  required_error: props.required_error ?? "ID is required for this operation"
})

const createProductSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name needs to be a string"
  })
    .min(3, { message: "The name must have 3 or more characters" }),
  subtitle: z.string({
    invalid_type_error: "Name needs to be a string"
  }).nullable(),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description needs to be a string"
  })
    .min(3, { message: "The description must have 3 or more characters" }),
  price: z.coerce.number({
    required_error: "Price is mandatory"
  })
})

export const productRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({
      id: idValidation({})
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.product.findFirstOrThrow({
        select: {
          id: true,
          description: true,
          name: true,
          price: true,
          subtitle: true,
          tranlations: {
            select: {
              id: true,
              languageId: true,
              description: true,
              name: true,
              price: true,
              subtitle: true,
            },
          }
        },
        where: {
          id: input.id
        }
      })
    })
  ,
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.product.findMany({
        select: {
          id: true,
          description: true,
          name: true,
          price: true,
          subtitle: true,
          tranlations: {
            select: {
              id: true,
              languageId: true,
              description: true,
              name: true,
              price: true,
              subtitle: true,
            },
          }
        }
      })
    }),
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.product.create({
        data: {
          description: input.description,
          name: input.name,
          price: input.price,
          subtitle: input.subtitle
        }
      })
    }),
  update: publicProcedure
    .input(createProductSchema.partial().extend({id: idValidation({})}))
    .mutation(async ({ctx, input}) => {
      return await ctx.db.product.update({
        where: {
          id: input.id
        },
        data: {
          ...input
        }
      })
    }),
  delete: publicProcedure
    .input(z.object({
      id: idValidation({})
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.product.delete({
        where: {
          id: input.id
        }
      })
    })
})