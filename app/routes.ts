import {
    type RouteConfig,
    index,
    route,
} from "@react-router/dev/routes"

export default [
    index("routes/home.tsx"),
    route("/login-fetcher", "routes/login-fetcher.tsx"),
    route("/login", "routes/login.tsx"),
    route("/todos", "routes/todos.tsx"),
    route("/signup", "routes/signup.tsx"),
] satisfies RouteConfig
