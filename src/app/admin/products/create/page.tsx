import React from "react"
import CreateProduct from "~/app/_components/products/create-product"

const AdminLanguagesDetailsIdPage: React.FC= () => {

  return (
    <main className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
        <CreateProduct />
      </div>
    </main>
  )
}

export default AdminLanguagesDetailsIdPage