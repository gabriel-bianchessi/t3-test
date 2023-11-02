"use client"
import React from "react"
import { api } from "~/trpc/react"

const ProductDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const id = Number(params.id)
  const { data, isLoading } = api.product.getById.useQuery({ id: id })

  return (
    <main className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
        {isLoading && <span>Carregando...</span>}
        {!data && !isLoading && <span>Produto não encontrado</span>}
        {data && (
          <div className="flex flex-row gap-8">

            <div className="flex flex-col g ap-2">
              <h2 className="text-3xl font-bold">{data.name}</h2>
              {data.subtitle && (
                <p className="text-sm text-zinc-500">{data.subtitle}</p>
              )}
              <p className="text-zinc-700 flex-wrap flex max-w-md">{data.description}</p>
            </div>
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-bold">R$ {data.price.toFixed(2)}</h1>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default ProductDetailPage