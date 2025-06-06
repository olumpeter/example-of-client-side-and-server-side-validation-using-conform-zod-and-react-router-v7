import type { Route } from "./+types/home"

export function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const value = url.searchParams.get("value")

    return {
        value: value ? JSON.parse(value) : undefined,
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { value } = loaderData

    return (
        <div>
            Submitted the following value:
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
    )
}
