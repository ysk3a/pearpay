<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { h } from 'vue'
import { Toaster } from '@/components/ui/sonner'

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
    console.log('::handleSubmit', values)
    toast.info('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM' + JSON.stringify(values),
        // action: {
        //     label: 'Undo',
        //     onClick: () => console.log('Undo'),
        // },
        // style: {
        //     background: '#6ee7b7'
        // },
        // class: 'my-toast',
        duration: Infinity,
        closeButton: true,

    })
})
</script>

<template>

    <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button type="submit">
            Submit
        </Button>
    </form>
</template>