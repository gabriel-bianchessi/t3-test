"use client"
import Link from "next/link";
import { api } from "~/trpc/react";

export default function Home() {
  const { data: products, isLoading: isLoadingProducts } = api.product.getAll.useQuery()

  return (
    <main className="flex flex-col pt-8 gap-8 ">
      <h1 className="text-3xl font-bold">Produtos</h1>

      {isLoadingProducts && (
        <div>
          <p>Carregando...</p>
        </div>
      )}

      {products?.length === 0 && (
        <div>
          <p>Nenhum produto cadastrado.</p>
        </div>
      )}


      {products && products?.length > 0 && (
        <div className="grid grid-cols-4 w-full gap-4">
          {products.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="bg-zinc-100 p-4 rounded-lg shadow-sm hover:bg-zinc-200 transition-colors duration-100">
              <div className="flex flex-col justify-center gap-2">
              
                <h3 className="font-bold">{product.name}</h3>
                {product.subtitle && (
                  <p className="text-sm text-zinc-500">{product.subtitle}</p>
                )}
                <p className="text-zinc-700 flex-wrap flex max-w-md">{product.description}</p>
                <p>R$ {product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
