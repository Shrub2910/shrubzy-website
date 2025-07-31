import type { UserType } from "~/types/user";

export const useUsersStore = defineStore('users', {
    state: (): {user: UserType | undefined} => ({user: undefined}),

    actions: {
        async fetchUser(id: string) {
            const requestFetch = useRequestFetch()
            this.user = await requestFetch<UserType>(`/api/users/${id}`)
        }
    }
})