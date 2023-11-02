"use client"
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle } from 'react-icons/ai';
import { api } from '~/trpc/react';

const ProductsPage: React.FC = () => {
  const ctx = api.useUtils()
  const { data: products, isLoading } = api.product.getAll.useQuery()
  const { mutate } = api.product.delete.useMutation({
    onSuccess: () => {
      void ctx.product.getAll.invalidate()
      toast.success("Produto deletado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar produto.")
    }
  })

  const handleDeleteProduct = (id: number) => {
    mutate({ id })
  }


  return <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
    <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Produtos</h1>
        <Link
          href="/admin/products/create"
          className="h-6 w-6 bg-green-500 flex items-center justify-center rounded-full"
          title="Adicionar produto"
        >
          <AiOutlinePlusCircle size="1rem" color="white" />
        </Link>
      </div>

      {products?.length === 0 && (
        <div>
          <p>Nenhuma produto cadastrado.</p>
        </div>
      )}

      {isLoading && (
        <div>
          <p>Carregando...</p>
        </div>
      )}

      {products && products?.length > 0 && (
        <div className="flex flex-col w-full gap-2">
          {products.map(product => (
            <div className="flex flex-row w-full justify-between items-center gap-6" key={product.id}>
              <div className="flex flex-col w-full">
                <h3 className="">{product.name}</h3>
                {product.subtitle && (
                  <p className="text-sm text-zinc-500">{product.subtitle}</p>
                )}
                <p className="text-zinc-700 flex-wrap flex max-w-md">{product.description}</p>
                <p>R$ {product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/admin/products/details/${product.id}`} className="h-6 w-6 bg-green-500 flex items-center justify-center rounded-full">
                  <AiOutlineEdit size="1rem" color="white" />
                </Link>
                <button className="h-6 w-6 bg-red-500 flex items-center justify-center rounded-full" onClick={() => { handleDeleteProduct(product.id) }}>
                  <AiOutlineDelete size="1rem" color="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </main>
}

export default ProductsPage;