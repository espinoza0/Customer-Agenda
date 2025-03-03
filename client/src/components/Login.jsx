// 'use client'

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "./ui/form";

import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const userSchema = z.object({
  username: z
    .string({
      required_error: "El Usuario es requerido.",
    })
    .min(2, {
      message: "El Usuario tiene que tener 2 carácteres como mínimo.",
    }),
  password: z.string({
    required_error: "Contraseña requerida.",
  }),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(userSchema),
  });
  const [credentialsError, setCredentialsError] = useState(null);

  const navigate = useNavigate();

  const user = "admin";
  const pass = "admin";

  const handleSubmit = form.handleSubmit((data) => {
    const { username, password } = data;
    if (username === user && password === pass) {
      navigate("/home");
    } else {
      setCredentialsError("Usuario o Contraseña incorrectos.");
    }
  });

  return (
    <Form {...form}>
      <form
        className="w-full space-y-6 max-w-[40rem] mx-auto p-5"
        onSubmit={handleSubmit}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="">Usuario:</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="">Contraseña:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder=""
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {credentialsError && <p className="text-red-600">{credentialsError}</p>}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </Form>
  );
}
