import { useRequestHeaders } from "nuxt/app";

export function useSSRHeaders() {
    return import.meta.server ? useRequestHeaders(['cookie']) : undefined
}