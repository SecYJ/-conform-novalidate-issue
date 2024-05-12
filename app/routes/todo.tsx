import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, useNavigation } from "@remix-run/react";
import { z } from "zod";

const schema = z.object({
	firstName: z
		.string({
			required_error: "First name is required",
		})
		.min(3, {
			message: "First name min length is 3",
		})
		.max(20, {
			message: "First name max length is 20",
		}),
	lastName: z
		.string({
			required_error: "Last name is required",
		})
		.min(3, {
			message: "Last name min length is 3",
		})
		.max(20, {
			message: "Last name max length is 20",
		}),
});

const TodoPage = () => {
	const navigation = useNavigation();

	const [form, fields] = useForm({
		constraint: getZodConstraint(schema),
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	return (
		<div className="p-10">
			<Form method="POST" {...getFormProps(form)} className="flex gap-3 mt-3 items-start">
				<div>
					<input
						{...getInputProps(fields.firstName, {
							type: "text",
						})}
						placeholder="First Name"
						className="border border-black p-1"
					/>
					{fields.firstName.errors && <p className="text-red-600">{fields.firstName.errors[0]}</p>}
				</div>
				<div>
					<input
						placeholder="Last Name"
						{...getInputProps(fields.lastName, {
							type: "text",
						})}
						className="border border-black p-1"
					/>
					{fields.lastName.errors && <p className="text-red-600">{fields.lastName.errors[0]}</p>}
				</div>
				<button
					type="submit"
					form={form.id}
					name="_action"
					value="add"
					className="border border-black p-1 rounded flex gap-2"
					disabled={navigation.state !== "idle"}
				>
					{navigation.state !== "idle" ? <span>Creating User</span> : <span>Add user</span>}
				</button>
			</Form>
		</div>
	);
};

export default TodoPage;
