/* eslint-disable @typescript-eslint/no-unused-vars */
import {zodResolver} from '@hookform/resolvers/zod'
import {Loader2} from 'lucide-react'
import {z} from 'zod'
import {
    Button,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Input,
    Textarea,
    Field,
    FieldError,
    FieldLabel
} from '@/modules/shared/components'
import {CREATE_COMPANY_FORM_ID} from "@/modules/companies/constants";
import {Controller, useForm} from "react-hook-form";

interface CompanyDialogFormProps {
    title: string
    description: string
    actionButtonText?: string
    onSubmit: (values: z.infer<typeof formSchema>) => void
    setDialogOpen?: (open: boolean) => void
    onSubmitMutation: any
    nameDefaultValue?: string
    descriptionDefaultValue?: string
}

export const formSchema = z.object({
    name: z.string().min(1, {message: 'Company name is required'}).max(50, {
        message: 'Company name must be at most 50 characters long'
    }),
    description: z.optional(z.string())
})

export const CompanyDialogForm = ({
                                      title,
                                      description,
                                      actionButtonText = 'Create',
                                      onSubmit,
                                      onSubmitMutation,
                                      nameDefaultValue = '',
                                      descriptionDefaultValue = ''
                                  }: CompanyDialogFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: nameDefaultValue,
            description: descriptionDefaultValue
        }
    })

    const handleSubmit = form.handleSubmit(async (values) => {
        onSubmit(values)
        form.reset()
    })

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form
                onSubmit={handleSubmit}
                className='space-y-2'
                id={CREATE_COMPANY_FORM_ID}
            >
                <Controller
                    control={form.control}
                    name='name'
                    render={({field, fieldState}) => {
                        const {ref, ...rest} = field
                        return (
                            <Field>
                                <FieldLabel>Company name</FieldLabel>
                                <Input
                                    placeholder=''
                                    {...rest}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )
                    }}
                />
                <Controller
                    control={form.control}
                    name='description'
                    render={({field, fieldState}) => {
                        const {ref, ...rest} = field
                        return (
                            <Field>
                                <FieldLabel>Company&#39;s description (optional)</FieldLabel>
                                <Textarea
                                    placeholder=''
                                    className='resize-none'
                                    {...rest}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )
                    }}
                />
            </form>
            <Button
                form={CREATE_COMPANY_FORM_ID}
                type='submit'
                disabled={onSubmitMutation.isPending || !form.formState.isValid}
            >
                {onSubmitMutation.isPending && <Loader2 className='animate-spin'/>}
                {actionButtonText}
            </Button>
        </DialogContent>
    )
}
