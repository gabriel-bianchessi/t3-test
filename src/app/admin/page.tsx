import Link from "next/link";

const routesInAdmin = [
  {
    name: "Posts",
    path: "/admin/posts",
  },
  {
    name: "Linguagens",
    path: "/admin/languages",
  },
];


export default function AdminPage() {
  return (
    <div>
      <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center">
        <div className="p-8 bg-zinc-100 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[320px]">
          <h1 className="text-xl font-bold">Admin</h1>
          <div className="flex flex-col gap-1">
            {routesInAdmin.map(route => (
              <Link href={route.path} key={route.path} className="w-full p-1 hover:bg-zinc-200 rounded-lg transition-colors duration-100">
                <span>{route.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
