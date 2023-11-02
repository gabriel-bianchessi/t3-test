"use client"
import React, { useEffect } from "react"
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "~/trpc/react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

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

const AdminLanguagesDetailsIdPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const id = Number(params.id)
  const router = useRouter()
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(editLanguageObjectShape)
  })
  const { handleSubmit, register } = formMethods
  const ctx = api.useUtils()
  const { data: language, isLoading: isLoadingDefault } = api.language.getById.useQuery({id: id})

  const { mutate, isLoading } = api.language.update.useMutation({
    onSuccess: () => {
      toast.success("Linguagem atualizada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao atualizar linguagem.")
    },
    async onSettled() {
      await ctx.language.getAll.invalidate()
      await ctx.language.getById.invalidate({id: id})
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate({ id, ...data })
    router.push("/admin/languages")
  }

  return (
    <main className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label>Nome</label>
              <input
                type="text" {...register("name")}
                defaultValue={isLoadingDefault ? "Carregando..." : language?.name}
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
                disabled={isLoading || isLoadingDefault}
              >
                {isLoading ? "Carregando..." : "Atualizar"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}

export default AdminLanguagesDetailsIdPage