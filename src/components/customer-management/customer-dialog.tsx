import { HTMLAttributes, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormProps, customerSchema } from "@/utils/schema";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/effect";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/model";

interface CustomerDialogProps extends HTMLAttributes<HTMLDivElement> {
  customer?: Customer;
  type: `Edit` | `Add`;
  onSave: (data: CustomerFormProps) => void;
}

const AddCustomerDialog: React.FC<CustomerDialogProps> = ({
  className,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormProps>({
    resolver: zodResolver(customerSchema),
    defaultValues: props.customer && {
      username: props.customer.username,
    },
  });

  useEffect(() => {
    props.customer && setValue("username", props.customer.username);
  }, [props.customer]);

  const handleFormSubmission: SubmitHandler<CustomerFormProps> = (data) => {
    props.onSave(data);
    if (props.type == `Add`) reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(handleFormSubmission)();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[30rem]">
        <DialogHeader className="min-h-10 mb-2">
          <DialogTitle className="text-[1.5rem]">
            {props.type} Customer Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmission)}>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <Label htmlFor="name" className="text-lg my-auto w-[20rem]">
                Customer name
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="name"
                {...register("username")}
                type="text"
                placeholder="eg: John Smith"
                className="h-full text-lg placeholder_italic placeholder_text-base focus-visible_ring-0 border-2 border-gray-300"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex justify-end">
              {(errors.root || errors.username) && (
                <div className="text-red-600 my-auto ml-auto mr-6 text-right">
                  {(errors.root || errors.username)!.message}
                </div>
              )}
              <Button
                disabled={isSubmitting}
                className={cn(
                  "mt-auto",
                  buttonVariants({ variant: "positive" })
                )}
              >
                {!isSubmitting ? (
                  "Save"
                ) : (
                  <>
                    <LoadingSpinner size={26} className="text-white" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
