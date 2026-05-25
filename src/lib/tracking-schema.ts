import { z } from "zod";

export const TrackEventSchema = z.object({
  event_name: z.enum(["PageView", "ViewContent", "Lead", "Contact"]),
  event_id: z.string().min(1).max(128),
  transaction_id: z.string().max(128).optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  name: z.string().max(120).optional(),
  gclid: z.string().max(512).optional(),
  wbraid: z.string().max(512).optional(),
  gbraid: z.string().max(512).optional(),
  modelo: z.string().max(64).optional(),
  page_path: z.string().max(256).optional(),
  ga_client_id: z.string().max(128).optional(),
  ga_session_id: z.string().max(128).optional(),
});
export type TrackEvent = z.infer<typeof TrackEventSchema>;

export const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  whatsapp: z.string().min(10).max(20),
  email: z.string().email().optional(),
  event_id: z.string().min(1).max(128).optional(),
  gclid: z.string().max(512).optional(),
  wbraid: z.string().max(512).optional(),
  gbraid: z.string().max(512).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
  utm_term: z.string().max(120).optional(),
  utm_content: z.string().max(120).optional(),
  modelo: z.string().max(64).optional(),
  ga_client_id: z.string().max(128).optional(),
  ga_session_id: z.string().max(128).optional(),
});
export type ContactInput = z.infer<typeof ContactSchema>;
