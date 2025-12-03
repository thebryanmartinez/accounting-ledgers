/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { CREATE_COMPANY_FORM_ID } from '@/modules/companies/constants';
import {
    Button,
    Checkbox,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Field,
    FieldError,
    FieldLabel,
    Input,
    Label,
    Textarea,
} from '@/modules/shared/components';

interface CompanyDialogFormProps {
    title: string;
    description: string;
    actionButtonText?: string;
    // TODO: Change to have z.infer<typeof formSchema>
    onSubmit: (values: any) => void;
    setDialogOpen?: (open: boolean) => void;
    onSubmitMutation: any;
    nameDefaultValue?: string;
    descriptionDefaultValue?: string;
    showActiveCheckbox?: boolean;
    isFirstCompany?: boolean;
}

export const formSchema = z.object({
    name: z.string().min(1, { message: 'companyNameRequired' }).max(50, {
        message: 'companyNameMaxLength',
    }),
    description: z.optional(z.string()),
    active: z.boolean().default(false),
});

export const CompanyDialogForm = ({
    title,
    description,
    actionButtonText,
    onSubmit,
    onSubmitMutation,
    nameDefaultValue = '',
    descriptionDefaultValue = '',
    showActiveCheckbox = false,
    isFirstCompany = false,
}: CompanyDialogFormProps) => {
    const t = useTranslations('companies');

    const formSchemaWithTranslations = z.object({
        name: z
            .string()
            .min(1, { message: t('companyNameRequired') })
            .max(50, {
                message: t('companyNameMaxLength'),
            }),
        description: z.optional(z.string()),
        active: z.boolean().default(false),
    });

    const form = useForm<z.infer<typeof formSchemaWithTranslations>>({
        resolver: zodResolver(formSchemaWithTranslations),
        defaultValues: {
            name: nameDefaultValue,
            description: descriptionDefaultValue,
            active: isFirstCompany,
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        const { active, ...rest } = values;
        onSubmit(rest);
        form.reset();
    });

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-2' id={CREATE_COMPANY_FORM_ID}>
                <Controller
                    control={form.control}
                    name='name'
                    render={({ field, fieldState }) => {
                        const { ref, ...rest } = field;
                        return (
                            <Field>
                                <FieldLabel>{t('companyName')}</FieldLabel>
                                <Input placeholder='' {...rest} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />
                <Controller
                    control={form.control}
                    name='description'
                    render={({ field, fieldState }) => {
                        const { ref, ...rest } = field;
                        return (
                            <Field>
                                <FieldLabel>{t('companyDescriptionOptional')}</FieldLabel>
                                <Textarea placeholder='' className='resize-none' {...rest} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />
                {showActiveCheckbox && (
                    <Controller
                        control={form.control}
                        name='active'
                        render={({ field: { value, onChange, ...field } }) => (
                            <div className='flex items-center space-x-2 mt-4'>
                                <Checkbox
                                    id='active'
                                    checked={value}
                                    onCheckedChange={onChange}
                                    disabled={isFirstCompany}
                                    {...field}
                                />
                                <Label htmlFor='active'>{t('setAsActive')}</Label>
                            </div>
                        )}
                    />
                )}
            </form>
            <Button
                form={CREATE_COMPANY_FORM_ID}
                type='submit'
                disabled={onSubmitMutation.isPending || !form.formState.isValid}
            >
                {onSubmitMutation.isPending && <Loader2 className='animate-spin' />}
                {actionButtonText}
            </Button>
        </DialogContent>
    );
};
