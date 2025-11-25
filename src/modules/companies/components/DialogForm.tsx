/* eslint-disable @typescript-eslint/no-unused-vars */
import {zodResolver} from '@hookform/resolvers/zod'
import {Loader2} from 'lucide-react'
import {z} from 'zod'
import {useTranslations} from 'next-intl'
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
    // TODO: Change to have z.infer<typeof formSchema>
    onSubmit: (values: any) => void
    setDialogOpen?: (open: boolean) => void
    onSubmitMutation: any
    nameDefaultValue?: string
    descriptionDefaultValue?: string
}


export const CompanyDialogForm = ({
                                      title,
                                      description,
                                      actionButtonText = 'Create',
                                      onSubmit,
                                      onSubmitMutation,
                                      nameDefaultValue = '',
                                      descriptionDefaultValue = ''
                                  }: CompanyDialogFormProps) => {
    const t = useTranslations('companies')

    const formSchema = z.object({
        name: z.string().min(1, {message: t('companyNameRequired')}).max(50, {
            message: t('companyNameMaxLength')
        }),
        description: z.optional(z.string())
    })

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
                                <FieldLabel>{t('companyName')}</FieldLabel>
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
                                <FieldLabel>{t('companyDescriptionOptional')}</FieldLabel>
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
