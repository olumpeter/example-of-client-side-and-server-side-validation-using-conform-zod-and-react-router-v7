import { Form, redirect } from "react-router"
import { z } from "zod"
import { conformZodMessage, parseWithZod } from "@conform-to/zod"
import {
    getFormProps,
    getInputProps,
    useForm,
} from "@conform-to/react"

import type { Intent } from "@conform-to/react"
import type { Route } from "./+types/signup"

function createSchema(
    intent: Intent | null,
    options?: {
        isUsernameUnique: (username: string) => Promise<boolean>
    }
) {
    return z
        .object({
            username: z
                .string({
                    required_error: "Username is required",
                })
                .regex(
                    /^[a-zA-Z0-9]+$/,
                    "Invalid username: Only letters or numbers are allowed"
                )
                .pipe(
                    z.string().superRefine((username, ctx) => {
                        const isValidatingUsername =
                            intent === null ||
                            (intent.type === "validate" &&
                                intent.payload.name === "username")

                        if (!isValidatingUsername) {
                            ctx.addIssue({
                                code: "custom",
                                message:
                                    conformZodMessage.VALIDATION_SKIPPED,
                            })
                            return
                        }

                        if (
                            typeof options?.isUsernameUnique !==
                            "function"
                        ) {
                            ctx.addIssue({
                                code: "custom",
                                message:
                                    conformZodMessage.VALIDATION_UNDEFINED,
                                fatal: true,
                            })
                            return
                        }

                        return options
                            .isUsernameUnique(username)
                            .then((isUnique) => {
                                if (!isUnique) {
                                    ctx.addIssue({
                                        code: "custom",
                                        message:
                                            "Username is already used",
                                    })
                                }
                            })
                    })
                ),
        })
        .and(
            z
                .object({
                    password: z.string({
                        required_error: "Password is required",
                    }),
                    confirmPassword: z.string({
                        required_error:
                            "Confirm password is required",
                    }),
                })
                .refine(
                    (data) => data.password === data.confirmPassword,
                    {
                        message: "Password does not match",
                        path: ["confirmPassword"],
                    }
                )
        )
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const submission = await parseWithZod(formData, {
        schema: (intent) =>
            createSchema(intent, {
                isUsernameUnique(username) {
                    return new Promise((resolve) =>
                        setTimeout(() => {
                            resolve(username !== "admin")
                        }, Math.random() * 300)
                    )
                },
            }),
        async: true,
    })

    if (submission.status !== "success") {
        return submission.reply()
    }

    return redirect(`/?value=${JSON.stringify(submission.value)}`)
}

export default function Signup({ actionData }: Route.ComponentProps) {
    const [form, fields] = useForm({
        lastResult: actionData,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: (intent) => createSchema(intent),
            })
        },
        shouldValidate: "onBlur",
    })

    return (
        <Form method="post" {...getFormProps(form)}>
            <label>
                <div>Username</div>
                <input
                    className={fields.username.errors ? "error" : ""}
                    {...getInputProps(fields.username, {
                        type: "text",
                    })}
                />
                <div>{fields.username.errors}</div>
            </label>
            <label>
                <div>Password</div>
                <input
                    className={fields.username.errors ? "error" : ""}
                    {...getInputProps(fields.password, {
                        type: "password",
                    })}
                />
                <div>{fields.password.errors}</div>
            </label>
            <label>
                <div>Confirm Password</div>
                <input
                    className={fields.username.errors ? "error" : ""}
                    {...getInputProps(fields.confirmPassword, {
                        type: "password",
                    })}
                />
                <div>{fields.confirmPassword.errors}</div>
            </label>
            <hr />
            <button>Signup</button>
        </Form>
    )
}
