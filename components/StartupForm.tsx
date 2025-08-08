"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

type FormState = {
  status: "INITIAL" | "SUCCESS" | "ERROR";
  error: string;
  errors?: {
    title?: string[];
    description?: string[];
    category?: string[];
    link?: string[];
    pitch?: string[];
  };
  _id?: string;
};

export const StartupForm = () => {
  const [pitch, setPitch] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast.success("Success", {
          description: "Your startup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        toast.error("Error", {
          description: "Please check your inputs and try again",
        });
        return {
          ...prevState,
          errors: fieldErrors,
          error: "Validation failed",
          status: "ERROR",
        };
      }

      toast.error("Error", {
        description: "An unexpected error has occurred",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const initialState: FormState = {
    error: "",
    status: "INITIAL",
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, initialState);

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {state.errors?.title && (
          <p className="startup-form_error">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {state.errors?.description && (
          <p className="startup-form_error">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {state.errors?.category && (
          <p className="startup-form_error">{state.errors.category[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
        {state.errors?.link && (
          <p className="startup-form_error">{state.errors.link[0]}</p>
        )}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {state.errors?.pitch && (
          <p className="startup-form_error">{state.errors.pitch[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-[#87CEFA] startup-form_btn text-black-600"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};