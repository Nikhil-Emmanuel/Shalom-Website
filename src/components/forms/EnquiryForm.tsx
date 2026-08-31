"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, INTENTS, intentLabel, type EnquiryInput } from "@/lib/enquiry";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "sent" }
  | { kind: "error"; message: string }
  | { kind: "fallback"; mailto: string };

export function EnquiryForm({ defaultIntent = "visit" }: { defaultIntent?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const successRef = useRef<HTMLDivElement>(null);

  // The form unmounts on success, which drops focus to the top of the document
  // and tells a screen-reader user nothing about what just happened. Move focus
  // onto the confirmation instead.
  useEffect(() => {
    if (status.kind === "sent") successRef.current?.focus();
  }, [status.kind]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { intent: defaultIntent, name: "", email: "", phone: "", message: "" },
  });

  const buildMailto = () => {
    const { name, email, phone, intent, message } = getValues();
    const body = [
      `Intent: ${intentLabel(intent)}`,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    return `mailto:${site.contact.emails[0]}?subject=${encodeURIComponent(
      `Website enquiry — ${intentLabel(intent)}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ kind: "idle" });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        reset();
        setStatus({ kind: "sent" });
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        mailUnconfigured?: boolean;
        error?: string;
      };

      if (data.mailUnconfigured) {
        setStatus({ kind: "fallback", mailto: buildMailto() });
        return;
      }

      setStatus({
        kind: "error",
        message: data.error ?? "Something went wrong. Please try again.",
      });
    } catch {
      setStatus({ kind: "fallback", mailto: buildMailto() });
    }
  });

  if (status.kind === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-green/30 bg-green/5 p-8"
      >
        <p className="font-display text-xl font-semibold text-ink">
          Thank you — that reached us.
        </p>
        <p className="mt-3 text-body">
          Someone from the home will get back to you. If it is urgent, email{" "}
          <a
            className="text-primary underline underline-offset-4"
            href={`mailto:${site.contact.emails[0]}`}
          >
            {site.contact.emails[0]}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Field label="Your name" error={errors.name?.message} htmlFor="name">
        <input
          id="name"
          autoComplete="name"
          className={inputClass(!!errors.name)}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          label="Phone"
          hint="Optional"
          error={errors.phone?.message}
          htmlFor="phone"
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass(!!errors.phone)}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field label="How would you like to help?" error={errors.intent?.message} htmlFor="intent">
        <select id="intent" className={inputClass(!!errors.intent)} {...register("intent")}>
          {INTENTS.map((intent) => (
            <option key={intent.value} value={intent.value}>
              {intent.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your message" error={errors.message?.message} htmlFor="message">
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass(!!errors.message), "resize-y")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot — visually and programmatically hidden from real users */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {status.message}
        </p>
      )}

      {status.kind === "fallback" && (
        <div role="alert" className="rounded-xl border border-hairline bg-surface-soft p-5 text-sm">
          <p className="text-body">
            Our contact form is not connected to email yet. Your message is
            ready to send from your own mail app instead.
          </p>
          <a
            href={status.mailto}
            className="mt-3 inline-flex items-center gap-2 font-medium text-primary underline underline-offset-4"
          >
            <Icon name="Mail" className="size-4" />
            Open it in your email app
          </a>
        </div>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
        {!isSubmitting && <Icon name="ArrowRight" className="size-4" />}
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full min-h-11 rounded-md border bg-canvas px-4 py-2.5 text-base text-ink",
    "transition-colors duration-200 placeholder:text-muted",
    hasError ? "border-destructive" : "border-hairline focus:border-primary",
  );
}

function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline gap-2 text-sm font-medium text-ink"
      >
        {label}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
