import { nullable, optional, string } from 'valibot'

export const StringSchema = string()
export const OptionalStringSchema = optional(string())
export const NullableStringSchema = nullable(string())
