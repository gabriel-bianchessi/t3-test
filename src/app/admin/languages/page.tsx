"use client"

import { api } from "~/trpc/react"
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai"
import Link from "next/link"
import toast from "react-hot-toast"

export default function AdminLanguagesPage() {
  const { data: languages, isLoading: isLoadingLanguages } = api.language.getAll.useQuery()
  const ctx = api.useUtils()

  const { mutate } = api.language.delete.useMutation({
    onSuccess: () => {
      void ctx.language.getAll.invalidate()
      toast.success("Linguagem deletada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar linguagem.")
    }
  })

  const handleDeleteLanguage = (id: number) => {
    mutate({ id })
  }


  return (
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
      <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
        <h1 className="text-xl font-bold">Linguagens</h1>

        {languages?.length === 0 && (
          <div>
            <p>Nenhuma linguagem cadastrada.</p>
          </div>
        )}

        {isLoadingLanguages && (
          <div>
            <p>Carregando...</p>
          </div>
        )}

        {languages && languages?.length > 0 && (
          <div className="flex flex-col w-full gap-2">
            {languages.map(language => (
              <div className="flex flex-row w-full justify-between items-center" key={language.id}>
                <span>{language.name}</span>
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/admin/languages/details/${language.id}`} className="h-6 w-6 bg-green-500 flex items-center justify-center rounded-full">
                    <AiOutlineEdit size="1rem" color="white" />
                  </Link>
                  <button className="h-6 w-6 bg-red-500 flex items-center justify-center rounded-full" onClick={() => {handleDeleteLanguage(language.id)}}>
                    <AiOutlineDelete size="1rem" color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}