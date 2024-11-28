import { render } from '@redwoodjs/testing/web'

import AuthCheckPage from './AuthCheckPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AuthCheckPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AuthCheckPage />)
    }).not.toThrow()
  })
})
