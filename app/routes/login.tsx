import { Form, redirect } from "react-router"
import { z } from "zod"
import { parseWithZod } from "@conform-to/zod"
import {
    useForm,
    getFormProps,
    getInputProps,
} from "@conform-to/react"

import type { Route } from "./+types/login"

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
    remember: z.boolean().optional(),
})

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })
    if (submission.status !== "success") {
        return submission.reply()
    }

    return redirect(`/?value=${JSON.stringify(submission.value)}`)
}

export default function Login({ actionData }: Route.ComponentProps) {
    const [form, fields] = useForm({
        lastResult: actionData,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    return (
        <Form method="post" {...getFormProps(form)}>
            <div>
                <label>Email</label>
                <input
                    className={!fields.email.valid ? "error" : ""}
                    {...getInputProps(fields.email, { type: "text" })}
                />
                <div>{fields.email.errors}</div>
            </div>
            <div>
                <label>Password</label>
                <input
                    className={!fields.password.valid ? "error" : ""}
                    {...getInputProps(fields.password, {
                        type: "password",
                    })}
                />
                <div>{fields.email.errors}</div>
            </div>
            <label>
                <div>
                    <span>Remember me</span>
                    <input
                        {...getInputProps(fields.remember, {
                            type: "checkbox",
                        })}
                    />
                </div>
            </label>
            <hr />
            <button>Login</button>
        </Form>
    )
}
