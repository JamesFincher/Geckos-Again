import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="min-h-screen bg-emerald-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to Gecko Inventory
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Manage your gecko collection with ease. Keep track of your geckos,
            breeding programs, and inventory all in one place.
          </p>
        </div>
      </div>
    </>
  )
}

export default HomePage
