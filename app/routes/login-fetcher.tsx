import { redirect, useFetcher } from "react-router"
import { z } from "zod"
import { parseWithZod } from "@conform-to/zod"
import {
    getFormProps,
    getInputProps,
    useForm,
} from "@conform-to/react"

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
    remember: z.boolean().optional(),
})

import type { Route } from "./+types/login-fetcher"

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })

    if (submission.status !== "success") {
        return submission.reply()
    }

    return redirect(`/?value=${JSON.stringify(submission.value)}`)
}

export default function Login({ actionData }: Route.ComponentProps) {
    const fetcher = useFetcher<typeof action>()
    const [form, field] = useForm({
        lastResult: fetcher.data,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
        <>
            <fetcher.Form method="post" {...getFormProps(form)}>
                <div>
                    <label>Email</label>
                    <input
                        className={!field.email.valid ? "error" : ""}
                        {...getInputProps(field.email, {
                            type: "email",
                        })}
                    />
                    <div>{field.email.errors}</div>
                </div>
                <div>
                    <label>Password</label>
                    <input
                        className={!field.email.valid ? "error" : ""}
                        {...getInputProps(field.password, {
                            type: "password",
                        })}
                    />
                    <div>{field.password.errors}</div>
                </div>
                <label>
                    <div>
                        <span>Remember me</span>
                        <input
                            {...getInputProps(field.remember, {
                                type: "checkbox",
                            })}
                        />
                    </div>
                </label>
                <hr />
                <button>Login</button>
            </fetcher.Form>
        </>
    )
}
