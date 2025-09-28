export type MenuNode = {
  id: string;
  name: string;
  badge?: string;
  active?: boolean;
  muted?: boolean;
  children?: MenuNode[];
};

export const menuTree: MenuNode[] = [
  {
    id: "systems",
    name: "Systems",
    active: true,
    children: [
      {
        id: "system-code",
        name: "System Code",
        children: [
          {
            id: "systems-node",
            name: "Systems",
            children: [
              {
                id: "system-code-node",
                name: "System Code",
                children: [
                  {
                    id: "code-registration",
                    name: "Code Registration",
                  },
                  {
                    id: "code-registration-2",
                    name: "Code Registration - 2",
                  },
                  {
                    id: "properties",
                    name: "Properties",
                  },
                  {
                    id: "menus",
                    name: "Menus",
                    active: true,
                  },
                ],
              },
              {
                id: "menu-registration",
                name: "Menu Registration",
              },
              {
                id: "menu-registration-detail",
                name: "Menu Registration Detail",
              },
            ],
          },
          {
            id: "api",
            name: "API List",
            children: [
              {
                id: "api-registration",
                name: "API Registration",
              },
              {
                id: "api-edit",
                name: "API Edit",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "users-groups",
    name: "Users & Group",
    children: [
      {
        id: "users",
        name: "Users",
        children: [
          {
            id: "user-account-registration",
            name: "User Account Registration",
          },
        ],
      },
      {
        id: "groups",
        name: "Groups",
        children: [
          {
            id: "user-group-registration",
            name: "User Group Registration",
          },
        ],
      },
      {
        id: "user-approval",
        name: "User Approval",
        children: [
          {
            id: "user-approval-detail",
            name: "User Approval Detail",
          },
        ],
      },
    ],
  },
  {
    id: "competition",
    name: "Competition",
    muted: true,
  },
];

