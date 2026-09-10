export const menuService = {

  getMenu(
    role?: string
  ) {

    if (role === "MASTER") {

      return [
        {
          id: "master",
          label: "Plataforma",
          path: "/master",
        },

        {
          id: "companies",
          label: "Empresas",
          path: "/master/empresas",
        },

        {
          id: "users",
          label: "Usuários",
          path: "/usuarios",
        },

        {
          id: "permissions",
          label: "Permissões",
          path: "/configuracoes/permissoes",
        },

        {
          id: "audit",
          label: "Auditoria",
          path: "/auditoria",
        },
      ];
    }

    /*
     * Menu legado.
     * Mantido para componentes ainda dependentes
     * de menuService.
     *
     * Não é a fonte da navegação MASTER nova.
     */
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
      },

      {
        id: "trt",
        label: "TRTs",
        path: "/dashboard/trt",
      },

      {
        id: "map",
        label: "Mapa",
        path: "/map",
      },
    ];
  },

  getMenuItems(
    role?: string
  ) {
    return this.getMenu(
      role
    );
  },
};
