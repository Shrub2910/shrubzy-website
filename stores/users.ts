import type { UserType } from "~/types/user";

export const useUsersStore = defineStore('users', {
    state: (): {user: UserType | undefined} => ({user: undefined}),

    actions: {
        async fetchUser(id: string) {
            const requestFetch = useRequestFetch()
            this.user = await requestFetch<UserType>(`/api/users/${id}`)
        },

        async changeUsername(username: string, userId: number) {
            const requestFetch = useRequestFetch()

            const {fetch: refreshSession} = useUserSession()

            await requestFetch('/api/users', {
                method: 'PATCH',
                body: {
                    username
                }
            }).then(async () => {
                    await refreshSession()
                    if (this.user && this.user.id === userId) {
                        this.user.username = username
                    }
                }
            )

        }
    }
})