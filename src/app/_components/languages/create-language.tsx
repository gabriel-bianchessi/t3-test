"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { api } from '~/trpc/react';

const editLanguageObjectShape = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name needs to be a string"
    })
    .min(3, { message: "The name must have 3 or more characters" })
    .max(75, { message: 'The name must have 75 or less characters' })
})

type FormValues = z.infer<typeof editLanguageObjectShape>

const CreateLanguage: React.FC = () => {
  const router = useRouter()
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(editLanguageObjectShape)
  })
  const { handleSubmit, register } = formMethods
  const ctx = api.useUtils()

  const { mutate, isLoading } = api.language.create.useMutation({
    onSuccess: () => {
      toast.success("Linguagem criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar linguagem.")
    },
    async onSettled() {
      await ctx.language.getAll.invalidate()
      router.push("/admin/languages")
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate(data)
  }

  return <FormProvider {...formMethods}>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label>Nome</label>
        <input
          type="text" {...register("name")}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-100"
        />
        <span className="text-red-500 text-xs">{formMethods.formState.errors.name?.message}</span>
      </div>
      <div className="flex flex-row gap-4">
        <button
          type="button"
          onClick={() => {
            router.push("/admin/languages")
          }}
          className="flex-1 rounded-lg border-2 border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {isLoading ? "Carregando..." : "Criar"}
        </button>
      </div>
    </form>
  </FormProvider>;
}

export default CreateLanguage;