"use client"

import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTicketStore } from "@/lib/store/ticket-store"
import { Plus } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Please provide more detail"),
    type: z.enum(["bug", "tweak", "feature"]),
})

export const NewTicketDialog = () => {
    const [open, setOpen] = React.useState(false)
    const { createTicket } = useTicketStore()

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "tweak"
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Map type to priority
        let priority: "low" | "medium" | "high" | "critical" = "medium"
        if (data.type === "bug") priority = "high"
        if (data.type === "feature") priority = "low"

        createTicket(data.title, data.description, priority)
        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                        <DialogDescription>
                            Describe the issue or request. We'll categorize it for you.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Subject</Label>
                            <Input id="title" placeholder="e.g., Header logo is blurry" {...register("title")} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Type of Request</Label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="bug" id="bug" className="peer sr-only" />
                                            <Label
                                                htmlFor="bug"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple cursor-pointer"
                                            >
                                                <span className="mb-2 text-xl">🐛</span>
                                                Bug
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="tweak" id="tweak" className="peer sr-only" />
                                            <Label
                                                htmlFor="tweak"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple cursor-pointer"
                                            >
                                                <span className="mb-2 text-xl">🎨</span>
                                                Tweak
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="feature" id="feature" className="peer sr-only" />
                                            <Label
                                                htmlFor="feature"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-brand-purple [&:has([data-state=checked])]:border-brand-purple cursor-pointer"
                                            >
                                                <span className="mb-2 text-xl">💡</span>
                                                Idea
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Please describe what's happening..."
                                className="min-h-[100px]"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
