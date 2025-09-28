export type SidebarItem = {
  id: string
  label: string
  items?: SidebarItem[] | undefined
}

export type SidebarSection = {
  id: string
  heading: string
  accent?: boolean
  items: SidebarItem[]
}

export const sidebarSections: SidebarSection[] = [
  {
    id: 'systems',
    heading: 'Systems',
    accent: true,
    items: [
      {
        id: 'systems-code',
        label: 'System Code',
      },
      {
        id: 'systems-properties',
        label: 'Properties',
      },
      {
        id: 'systems-menus',
        label: 'Menus',
      },
      {
        id: 'systems-api',
        label: 'API List',
      },
    ],
  },
  {
    id: 'users-groups',
    heading: 'Users & Group',
    items: [
      {
        id: 'users-and-group',
        label: 'Users & Group',
      },
    ],
  },
  {
    id: 'competition',
    heading: 'Competition',
    items: [
      {
        id: 'competition-item',
        label: 'Competition',
      },
    ],
  },
]
