"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SocialForm from "@/components/auth/social-form";
import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = () => {
  return (
    <main>
      <motion.div
        className="flex flex-1 items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Card className="border-border/70 bg-card/20 w-full max-w-md shadow-[0_10px_26px_#e0e0e0a1] backdrop-blur-lg dark:shadow-none">
            <CardContent className="space-y-6 p-8">
              {/* Logo and Header */}
              <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold tracking-tight md:text-4xl">
                    Register
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link
                    prefetch={false}
                    href="/auth/login"
                    className="text-muted-foreground hover:text-primary underline"
                  >
                    log in
                  </Link>{" "}
                  to flow with your business.
                </p>
              </motion.div>

              <RegisterForm />

              {/* Divider */}
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="border-border w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card text-muted-foreground px-2">OR</span>
                </div>
              </motion.div>

              <SocialForm />

              {/* Terms */}
              <motion.p
                className="text-muted-foreground mt-2 text-center text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
              >
                By signing in you agree to our{" "}
                <Link
                  prefetch={false}
                  href="#"
                  className="text-muted-foreground hover:text-primary underline"
                >
                  terms of service
                </Link>{" "}
                and{" "}
                <Link
                  prefetch={false}
                  href="#"
                  className="text-muted-foreground hover:text-primary underline"
                >
                  privacy policy
                </Link>
                .
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
