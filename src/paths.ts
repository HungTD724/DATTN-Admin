export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    rooms: '/dashboard/rooms',
    roomDone: '/dashboard/room_done',
    integrations: '/dashboard/integrations',
    XacNhanPhong: '/dashboard/XacNhanPhong/',

    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
