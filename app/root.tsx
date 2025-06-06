import {
    isRouteErrorResponse,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router"

import type { Route } from "./+types/root"
// import "./app.css";
import styleUrl from "~/styles.css?url"

export const links: Route.LinksFunction = () => [
    { rel: "stylesheet", href: styleUrl },
]

export const meta: Route.MetaFunction = () => [
    { title: "React Router v7 - Conform Example" },
]

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <main>
                    <h1>Remix Example</h1>
                    <p>
                        This example demonstrates some of the features
                        of Conform including{" "}
                        <strong>client validation</strong>,{" "}
                        <strong>nested list</strong> and{" "}
                        <strong>async validation with zod</strong>
                    </p>
                    <ul>
                        <li>
                            <Link to="login">Login</Link> (
                            <Link to="login-fetcher">
                                with useFetcher
                            </Link>
                            )
                        </li>
                        <li>
                            <Link to="todos">Todo list</Link>
                        </li>
                        <li>
                            <Link to="signup">Signup</Link>
                        </li>
                    </ul>

                    <hr />
                    {children}
                </main>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!"
    let details = "An unexpected error occurred."
    let stack: string | undefined

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error"
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details
    } else if (
        import.meta.env.DEV &&
        error &&
        error instanceof Error
    ) {
        details = error.message
        stack = error.stack
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    )
}
