import { MetaTags } from '@redwoodjs/web'

const GeckosPage = () => {
  return (
    <>
      <MetaTags title="Geckos" description="My Geckos page" />

      <h1>My Geckos</h1>
      <p>This page is protected and only visible to authenticated users.</p>
    </>
  )
}

export default GeckosPage