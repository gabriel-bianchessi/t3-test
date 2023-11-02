import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

const createValidation = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name needs to be a string"
    })
    .min(3, { message: "The name must have 3 or more characters" })
})

const updateValidation = z.object({
  id: z.coerce.number({
    invalid_type_error: "ID needs to be a number",
    required_error: "ID is required for this operation"
  }),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name needs to be a string"
    })
    .min(3, { message: "The name must have 3 or more characters" })
})

const getByIdAndDeleteValidation = z.object({
  id: z.coerce.number({
    invalid_type_error: "ID needs to be a number",
    required_error: "ID is required for this operation"
  }),
})

export const languageRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.language.findMany()
  }),
  getById: publicProcedure
    .input(getByIdAndDeleteValidation)
    .query(async ({ctx, input}) => {
      return await ctx.db.language.findUniqueOrThrow({
        where: {
          id: input.id
        }
      })
    }),
  create: publicProcedure
    .input(createValidation)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.language.create({
        data: {
          name: input.name
        }
      })
    }),
  update: publicProcedure
    .input(updateValidation)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.language.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name
        }
      })
    }),
  delete: publicProcedure
    .input(getByIdAndDeleteValidation)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.language.delete({
        where: {
          id: input.id
        }
      })
    })
})