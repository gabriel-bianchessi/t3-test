import React from "react"
import EditLanguage from "~/app/_components/edit-language"

const AdminLanguagesDetailsIdPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const id = Number(params.id)

  return (
    <main className="w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
        <EditLanguage id={id} />
      </div>
    </main>
  )
}

export default AdminLanguagesDetailsIdPage