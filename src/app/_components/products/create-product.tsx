"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { api } from '~/trpc/react';


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

type FormValues = z.infer<typeof createProductSchema>

const CreateProduct: React.FC = () => {
  const router = useRouter()
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(createProductSchema)
  })
  const { handleSubmit, register } = formMethods
  const ctx = api.useUtils()

  const { mutate, isLoading } = api.product.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar produto.")
    },
    async onSettled() {
      await ctx.product.getAll.invalidate()
      router.push("/admin/products")
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate(data)
  }

  return <FormProvider {...formMethods}>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <div>
        <div className="flex flex-col gap-2">
          <label>Nome</label>
          <input
            type="text" {...register("name")}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-100"
          />
          <span className="text-red-500 text-xs">{formMethods.formState.errors.name?.message}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label>Subtítulo</label>
          <input
            type="text" {...register("subtitle")}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-100"
          />
          <span className="text-red-500 text-xs">{formMethods.formState.errors.subtitle?.message}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label>Descrição</label>
          <textarea
            {...register("description")}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-100"
          />
          <span className="text-red-500 text-xs">{formMethods.formState.errors.description?.message}</span>
        </div>
        <div className="flex flex-col gap-2">
          <label>Preço</label>
          <input
            type="number" {...register("price")}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-100"
          />
          <span className="text-red-500 text-xs">{formMethods.formState.errors.price?.message}</span>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <button
          type="button"
          onClick={() => {
            router.push("/admin/products")
          }}
          className="flex-1 rounded-lg border-2 border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Criar"}
        </button>
      </div>
    </form>
  </FormProvider>
}

export default CreateProduct