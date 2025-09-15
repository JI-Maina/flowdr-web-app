"use client";

import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Rotate3d } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginSchema } from "@/lib/schemas";
import { useFlowdrStore } from "@/store/store";
import { loginUser } from "@/actions/auth-action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const LoginForm = () => {
  const router = useRouter();
  const { updateUser } = useFlowdrStore((state) => state);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginUser(values);

      if (res.error) {
        toast.error(res.error["detail"]);
      } else {
        const user = {
          id: res.id,
          role: res.role,
          username: res.username,
          companyId: res.company_id,
        };

        updateUser(user);

        console.log(res.company_id === null);
        if (res.company_id === null) {
          router.push("/company/set-up");
        } else {
          router.push(`/company/${res.company_id}`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed! No internet connection.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="flowdr@support.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Rotate3d className="ml-2 w-4 h-4 animate-spin" />
              )}{" "}
              Continue
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
