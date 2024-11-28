import type { Meta, StoryObj } from '@storybook/react'

import AuthCheckPage from './AuthCheckPage'

const meta: Meta<typeof AuthCheckPage> = {
  component: AuthCheckPage,
}

export default meta

type Story = StoryObj<typeof AuthCheckPage>

export const Primary: Story = {}
