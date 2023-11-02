import Link from 'next/link';
import React from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

// import { Container } from './styles';

const ProductsPage: React.FC = () => {
  return <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
    <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Produtos</h1>
        <Link
          href="/admin/products/"
          className="h-6 w-6 bg-green-500 flex items-center justify-center rounded-full"
          title="Adicionar produto"
        >
          <AiOutlinePlusCircle size="1rem" color="white" />
        </Link>
      </div>
    </div>
  </main>
}

export default ProductsPage;