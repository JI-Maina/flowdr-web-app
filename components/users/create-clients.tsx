"use client";

import z from "zod";
import { toast } from "sonner";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Rotate3D, UserCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFlowdrStore } from "@/store/store";
import { createUser } from "@/actions/create-users";
import { clientSchema, VENDORTYPE } from "@/lib/schemas";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CreateClientsModal = () => {
  const [open, setOpen] = useState(false);
  const { branches } = useFlowdrStore((state) => state.store);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      clientType: VENDORTYPE[0],
      company: "",
      phone: "",
      branch: branches[0].id || "",
    },
  });

  const router = useRouter();
  const companyId = usePathname().split("/")[2] || "";

  const onSubmit = async (values: z.infer<typeof clientSchema>) => {
    const client = {
      user: {
        role: "customer",
        username: values.username,
        email: values.email,
        password: "customerPassword",
      },
      first_name: values.firstName,
      last_name: values.lastName,
      client_type: values.clientType,
      company_name: values.company,
      phone: values.phone,
      branch: values.branch,
      is_active: true,
    };

    try {
      const res = await createUser(
        `/users/company/${companyId}/clients/`,
        client
      );

      if (res.error === "0") {
        setOpen(false);
        toast.success("Client created", { description: res.message });
        router.refresh();
      } else {
        toast.error("Creation Failed!", {
          description: res.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Creation Failed!", {
        description: "Server error, try again later!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserCircle2 className="w-4 h-4" />
          Add Client
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Client
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            You are creating a new client for your company
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="px-6 py-4 space-y-6">
            <FormField
              name="branch"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Branch <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={branches[0]?.id || ""}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11">
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Username <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="flowdr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="flowdr@support.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Client Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Client Information
              </h3>

              <FormField
                name="clientType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Client Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"INDIVIDUAL"}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-11">
                        <SelectValue placeholder="Select vendor type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDORTYPE.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Client Company
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Majimoto stores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Primary Phone No.{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0700000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="phoneTwo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Secondary Phone No.
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0700000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <DialogClose asChild>
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
            </DialogClose>

            <Button className="px-6" onClick={form.handleSubmit(onSubmit)}>
              Create Client{" "}
              {form.formState.isSubmitting && (
                <Rotate3D className="w-4 h-4 animate-spin" />
              )}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientsModal;
