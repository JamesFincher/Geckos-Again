// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'

import { useAuth } from './auth'
import MainLayout from './layouts/MainLayout/MainLayout'
import AuthCheckPage from './pages/AuthCheckPage/AuthCheckPage'
import BreedingPage from './pages/BreedingPage/BreedingPage'
import GeckosPage from './pages/GeckosPage/GeckosPage'
import HomePage from './pages/HomePage/HomePage'
import InventoryPage from './pages/InventoryPage/InventoryPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={MainLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/auth-check" page={AuthCheckPage} name="authCheck" />

        {/* Protected Routes */}
        <Private unauthenticated="home">
          <Route path="/geckos" page={GeckosPage} name="geckos" />
          <Route path="/breeding" page={BreedingPage} name="breeding" />
          <Route path="/inventory" page={InventoryPage} name="inventory" />
        </Private>

        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
