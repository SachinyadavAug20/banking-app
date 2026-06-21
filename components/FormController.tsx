import { Controller } from "react-hook-form";
import { FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { capitalize } from "@/lib/utils";

interface Props{
  name:string,
  autoComplete?:string,
  placeholder?:string,
  form:any
}

const FormController = ({name,autoComplete,placeholder,form}:Props) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <div className="form-item py-1!">
          <FieldLabel htmlFor="form-rhf-input-username" className="form-label text-gray-900!">
            {capitalize(name)}
          </FieldLabel>
          <div className="flex w-full flex-col">
            <Input
              {...field}
              id="form-rhf-input-username"
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
