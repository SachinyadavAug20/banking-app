import { Control, Controller, FieldPath } from "react-hook-form";
import { FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { capitalize, formSchema as forms } from "@/lib/utils";
import z from "zod";
const formSchema = forms("sign-up");

interface Props {
  name: FieldPath<z.infer<typeof formSchema>>;
  autoComplete?: string;
  placeholder?: string;
  control: Control<z.infer<typeof formSchema>>;
  type?: string;
}

const FormController = ({
  name,
  type = "text",
  autoComplete,
  placeholder,
  control,
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="form-item py-1!">
          <FieldLabel
            htmlFor="form-rhf-input-username"
            className="form-label text-gray-900!"
          >
            {capitalize(name)}
          </FieldLabel>
          <div className="flex w-full flex-col">
            <Input
              {...field}
              id="form-rhf-input-username"
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className="input-class"
            />
          </div>
          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="form-message mt-2"
            />
          )}
        </div>
      )}
    />
  );
};

export default FormController;
