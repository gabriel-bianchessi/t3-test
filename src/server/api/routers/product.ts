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

const createLanguageSchema = z.object({
  languageId: idValidation({
    required_error: "Language ID is required"
  }),
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

const creationSchema = z.array(createLanguageSchema).superRefine((i, context) => {
  if (i.length === 0) {
    context.addIssue({
      code: "too_small",
      inclusive: true,
      minimum: 1,
      type: "array"
    });
  }
});

export const Productrouter = createTRPCRouter({
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
    .input(creationSchema)
    .mutation(async ({ ctx, input }) => {
      const productId = await ctx.db.language.create({
        data: input[0]!,
        select: {
          id: true
        }
      })

      for (const {
        description,
        languageId,
        name,
        price,
        subtitle
      } of input) {
        await ctx.db.productHasLanguage.create({
          data: {
            description,
            name,
            price,
            subtitle,
            languageId,
            productId: productId.id
          }
        })
      }
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