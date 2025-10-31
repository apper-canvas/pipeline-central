import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
    label, 
    error, 
    required = false, 
    type = "text",
    className = "",
    ...inputProps 
}) => {
    return (
        <div className={className}>
            {label && (
                <Label>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <Input 
                type={type}
                className={error ? "border-red-500 focus:ring-red-500" : ""}
                {...inputProps}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormField;