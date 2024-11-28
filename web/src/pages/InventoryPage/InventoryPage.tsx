import { MetaTags } from '@redwoodjs/web'

const InventoryPage = () => {
  return (
    <>
      <MetaTags title="Inventory" description="Inventory page" />

      <h1>Inventory</h1>
      <p>This page is protected and only visible to authenticated users.</p>
    </>
  )
}

export default InventoryPage