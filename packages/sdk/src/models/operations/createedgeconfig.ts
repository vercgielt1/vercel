/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";

export type Two4 = {};

export type Items2 = Two4 | string | number | boolean;

export type One4 = {};

export type Items1 = One4 | string | number | boolean;

export type Items =
  | One4
  | string
  | number
  | boolean
  | Array<Two4 | string | number | boolean>;

export type CreateEdgeConfigRequestBody = {
  slug: string;
  items?: {
    [k: string]:
      | One4
      | string
      | number
      | boolean
      | Array<Two4 | string | number | boolean>;
  } | undefined;
};

export type CreateEdgeConfigRequest = {
  /**
   * The Team identifier to perform the request on behalf of.
   */
  teamId?: string | undefined;
  /**
   * The Team slug to perform the request on behalf of.
   */
  slug?: string | undefined;
  requestBody?: CreateEdgeConfigRequestBody | undefined;
};

/**
 * Keeps track of the current state of the Edge Config while it gets transferred.
 */
export type CreateEdgeConfigTransfer = {
  fromAccountId: string;
  startedAt: number;
  doneAt: number | null;
};

export type CreateEdgeConfigSchema = {};

/**
 * An Edge Config
 */
export type CreateEdgeConfigResponseBody = {
  createdAt?: number | undefined;
  updatedAt?: number | undefined;
  id?: string | undefined;
  /**
   * Name for the Edge Config Names are not unique. Must start with an alphabetic character and can contain only alphanumeric characters and underscores).
   */
  slug?: string | undefined;
  ownerId?: string | undefined;
  digest?: string | undefined;
  /**
   * Keeps track of the current state of the Edge Config while it gets transferred.
   */
  transfer?: CreateEdgeConfigTransfer | undefined;
  schema?: CreateEdgeConfigSchema | undefined;
  sizeInBytes: number;
  itemCount: number;
};

/** @internal */
export const Two4$inboundSchema: z.ZodType<Two4, z.ZodTypeDef, unknown> = z
  .object({});

/** @internal */
export type Two4$Outbound = {};

/** @internal */
export const Two4$outboundSchema: z.ZodType<Two4$Outbound, z.ZodTypeDef, Two4> =
  z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Two4$ {
  /** @deprecated use `Two4$inboundSchema` instead. */
  export const inboundSchema = Two4$inboundSchema;
  /** @deprecated use `Two4$outboundSchema` instead. */
  export const outboundSchema = Two4$outboundSchema;
  /** @deprecated use `Two4$Outbound` instead. */
  export type Outbound = Two4$Outbound;
}

/** @internal */
export const Items2$inboundSchema: z.ZodType<Items2, z.ZodTypeDef, unknown> = z
  .union([
    z.lazy(() => Two4$inboundSchema),
    z.string(),
    z.number(),
    z.boolean(),
  ]);

/** @internal */
export type Items2$Outbound = Two4$Outbound | string | number | boolean;

/** @internal */
export const Items2$outboundSchema: z.ZodType<
  Items2$Outbound,
  z.ZodTypeDef,
  Items2
> = z.union([
  z.lazy(() => Two4$outboundSchema),
  z.string(),
  z.number(),
  z.boolean(),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Items2$ {
  /** @deprecated use `Items2$inboundSchema` instead. */
  export const inboundSchema = Items2$inboundSchema;
  /** @deprecated use `Items2$outboundSchema` instead. */
  export const outboundSchema = Items2$outboundSchema;
  /** @deprecated use `Items2$Outbound` instead. */
  export type Outbound = Items2$Outbound;
}

/** @internal */
export const One4$inboundSchema: z.ZodType<One4, z.ZodTypeDef, unknown> = z
  .object({});

/** @internal */
export type One4$Outbound = {};

/** @internal */
export const One4$outboundSchema: z.ZodType<One4$Outbound, z.ZodTypeDef, One4> =
  z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace One4$ {
  /** @deprecated use `One4$inboundSchema` instead. */
  export const inboundSchema = One4$inboundSchema;
  /** @deprecated use `One4$outboundSchema` instead. */
  export const outboundSchema = One4$outboundSchema;
  /** @deprecated use `One4$Outbound` instead. */
  export type Outbound = One4$Outbound;
}

/** @internal */
export const Items1$inboundSchema: z.ZodType<Items1, z.ZodTypeDef, unknown> = z
  .union([
    z.lazy(() => One4$inboundSchema),
    z.string(),
    z.number(),
    z.boolean(),
  ]);

/** @internal */
export type Items1$Outbound = One4$Outbound | string | number | boolean;

/** @internal */
export const Items1$outboundSchema: z.ZodType<
  Items1$Outbound,
  z.ZodTypeDef,
  Items1
> = z.union([
  z.lazy(() => One4$outboundSchema),
  z.string(),
  z.number(),
  z.boolean(),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Items1$ {
  /** @deprecated use `Items1$inboundSchema` instead. */
  export const inboundSchema = Items1$inboundSchema;
  /** @deprecated use `Items1$outboundSchema` instead. */
  export const outboundSchema = Items1$outboundSchema;
  /** @deprecated use `Items1$Outbound` instead. */
  export type Outbound = Items1$Outbound;
}

/** @internal */
export const Items$inboundSchema: z.ZodType<Items, z.ZodTypeDef, unknown> = z
  .union([
    z.union([
      z.lazy(() => One4$inboundSchema),
      z.string(),
      z.number(),
      z.boolean(),
    ]),
    z.array(
      z.union([
        z.lazy(() => Two4$inboundSchema),
        z.string(),
        z.number(),
        z.boolean(),
      ]),
    ),
  ]);

/** @internal */
export type Items$Outbound =
  | One4$Outbound
  | string
  | number
  | boolean
  | Array<Two4$Outbound | string | number | boolean>;

/** @internal */
export const Items$outboundSchema: z.ZodType<
  Items$Outbound,
  z.ZodTypeDef,
  Items
> = z.union([
  z.union([
    z.lazy(() => One4$outboundSchema),
    z.string(),
    z.number(),
    z.boolean(),
  ]),
  z.array(
    z.union([
      z.lazy(() => Two4$outboundSchema),
      z.string(),
      z.number(),
      z.boolean(),
    ]),
  ),
]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Items$ {
  /** @deprecated use `Items$inboundSchema` instead. */
  export const inboundSchema = Items$inboundSchema;
  /** @deprecated use `Items$outboundSchema` instead. */
  export const outboundSchema = Items$outboundSchema;
  /** @deprecated use `Items$Outbound` instead. */
  export type Outbound = Items$Outbound;
}

/** @internal */
export const CreateEdgeConfigRequestBody$inboundSchema: z.ZodType<
  CreateEdgeConfigRequestBody,
  z.ZodTypeDef,
  unknown
> = z.object({
  slug: z.string(),
  items: z.record(
    z.union([
      z.union([
        z.lazy(() => One4$inboundSchema),
        z.string(),
        z.number(),
        z.boolean(),
      ]),
      z.array(
        z.union([
          z.lazy(() => Two4$inboundSchema),
          z.string(),
          z.number(),
          z.boolean(),
        ]),
      ),
    ]),
  ).optional(),
});

/** @internal */
export type CreateEdgeConfigRequestBody$Outbound = {
  slug: string;
  items?: {
    [k: string]:
      | One4$Outbound
      | string
      | number
      | boolean
      | Array<Two4$Outbound | string | number | boolean>;
  } | undefined;
};

/** @internal */
export const CreateEdgeConfigRequestBody$outboundSchema: z.ZodType<
  CreateEdgeConfigRequestBody$Outbound,
  z.ZodTypeDef,
  CreateEdgeConfigRequestBody
> = z.object({
  slug: z.string(),
  items: z.record(
    z.union([
      z.union([
        z.lazy(() => One4$outboundSchema),
        z.string(),
        z.number(),
        z.boolean(),
      ]),
      z.array(
        z.union([
          z.lazy(() => Two4$outboundSchema),
          z.string(),
          z.number(),
          z.boolean(),
        ]),
      ),
    ]),
  ).optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateEdgeConfigRequestBody$ {
  /** @deprecated use `CreateEdgeConfigRequestBody$inboundSchema` instead. */
  export const inboundSchema = CreateEdgeConfigRequestBody$inboundSchema;
  /** @deprecated use `CreateEdgeConfigRequestBody$outboundSchema` instead. */
  export const outboundSchema = CreateEdgeConfigRequestBody$outboundSchema;
  /** @deprecated use `CreateEdgeConfigRequestBody$Outbound` instead. */
  export type Outbound = CreateEdgeConfigRequestBody$Outbound;
}

/** @internal */
export const CreateEdgeConfigRequest$inboundSchema: z.ZodType<
  CreateEdgeConfigRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  RequestBody: z.lazy(() => CreateEdgeConfigRequestBody$inboundSchema)
    .optional(),
}).transform((v) => {
  return remap$(v, {
    "RequestBody": "requestBody",
  });
});

/** @internal */
export type CreateEdgeConfigRequest$Outbound = {
  teamId?: string | undefined;
  slug?: string | undefined;
  RequestBody?: CreateEdgeConfigRequestBody$Outbound | undefined;
};

/** @internal */
export const CreateEdgeConfigRequest$outboundSchema: z.ZodType<
  CreateEdgeConfigRequest$Outbound,
  z.ZodTypeDef,
  CreateEdgeConfigRequest
> = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  requestBody: z.lazy(() => CreateEdgeConfigRequestBody$outboundSchema)
    .optional(),
}).transform((v) => {
  return remap$(v, {
    requestBody: "RequestBody",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateEdgeConfigRequest$ {
  /** @deprecated use `CreateEdgeConfigRequest$inboundSchema` instead. */
  export const inboundSchema = CreateEdgeConfigRequest$inboundSchema;
  /** @deprecated use `CreateEdgeConfigRequest$outboundSchema` instead. */
  export const outboundSchema = CreateEdgeConfigRequest$outboundSchema;
  /** @deprecated use `CreateEdgeConfigRequest$Outbound` instead. */
  export type Outbound = CreateEdgeConfigRequest$Outbound;
}

/** @internal */
export const CreateEdgeConfigTransfer$inboundSchema: z.ZodType<
  CreateEdgeConfigTransfer,
  z.ZodTypeDef,
  unknown
> = z.object({
  fromAccountId: z.string(),
  startedAt: z.number(),
  doneAt: z.nullable(z.number()),
});

/** @internal */
export type CreateEdgeConfigTransfer$Outbound = {
  fromAccountId: string;
  startedAt: number;
  doneAt: number | null;
};

/** @internal */
export const CreateEdgeConfigTransfer$outboundSchema: z.ZodType<
  CreateEdgeConfigTransfer$Outbound,
  z.ZodTypeDef,
  CreateEdgeConfigTransfer
> = z.object({
  fromAccountId: z.string(),
  startedAt: z.number(),
  doneAt: z.nullable(z.number()),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateEdgeConfigTransfer$ {
  /** @deprecated use `CreateEdgeConfigTransfer$inboundSchema` instead. */
  export const inboundSchema = CreateEdgeConfigTransfer$inboundSchema;
  /** @deprecated use `CreateEdgeConfigTransfer$outboundSchema` instead. */
  export const outboundSchema = CreateEdgeConfigTransfer$outboundSchema;
  /** @deprecated use `CreateEdgeConfigTransfer$Outbound` instead. */
  export type Outbound = CreateEdgeConfigTransfer$Outbound;
}

/** @internal */
export const CreateEdgeConfigSchema$inboundSchema: z.ZodType<
  CreateEdgeConfigSchema,
  z.ZodTypeDef,
  unknown
> = z.object({});

/** @internal */
export type CreateEdgeConfigSchema$Outbound = {};

/** @internal */
export const CreateEdgeConfigSchema$outboundSchema: z.ZodType<
  CreateEdgeConfigSchema$Outbound,
  z.ZodTypeDef,
  CreateEdgeConfigSchema
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateEdgeConfigSchema$ {
  /** @deprecated use `CreateEdgeConfigSchema$inboundSchema` instead. */
  export const inboundSchema = CreateEdgeConfigSchema$inboundSchema;
  /** @deprecated use `CreateEdgeConfigSchema$outboundSchema` instead. */
  export const outboundSchema = CreateEdgeConfigSchema$outboundSchema;
  /** @deprecated use `CreateEdgeConfigSchema$Outbound` instead. */
  export type Outbound = CreateEdgeConfigSchema$Outbound;
}

/** @internal */
export const CreateEdgeConfigResponseBody$inboundSchema: z.ZodType<
  CreateEdgeConfigResponseBody,
  z.ZodTypeDef,
  unknown
> = z.object({
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  id: z.string().optional(),
  slug: z.string().optional(),
  ownerId: z.string().optional(),
  digest: z.string().optional(),
  transfer: z.lazy(() => CreateEdgeConfigTransfer$inboundSchema).optional(),
  schema: z.lazy(() => CreateEdgeConfigSchema$inboundSchema).optional(),
  sizeInBytes: z.number(),
  itemCount: z.number(),
});

/** @internal */
export type CreateEdgeConfigResponseBody$Outbound = {
  createdAt?: number | undefined;
  updatedAt?: number | undefined;
  id?: string | undefined;
  slug?: string | undefined;
  ownerId?: string | undefined;
  digest?: string | undefined;
  transfer?: CreateEdgeConfigTransfer$Outbound | undefined;
  schema?: CreateEdgeConfigSchema$Outbound | undefined;
  sizeInBytes: number;
  itemCount: number;
};

/** @internal */
export const CreateEdgeConfigResponseBody$outboundSchema: z.ZodType<
  CreateEdgeConfigResponseBody$Outbound,
  z.ZodTypeDef,
  CreateEdgeConfigResponseBody
> = z.object({
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  id: z.string().optional(),
  slug: z.string().optional(),
  ownerId: z.string().optional(),
  digest: z.string().optional(),
  transfer: z.lazy(() => CreateEdgeConfigTransfer$outboundSchema).optional(),
  schema: z.lazy(() => CreateEdgeConfigSchema$outboundSchema).optional(),
  sizeInBytes: z.number(),
  itemCount: z.number(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateEdgeConfigResponseBody$ {
  /** @deprecated use `CreateEdgeConfigResponseBody$inboundSchema` instead. */
  export const inboundSchema = CreateEdgeConfigResponseBody$inboundSchema;
  /** @deprecated use `CreateEdgeConfigResponseBody$outboundSchema` instead. */
  export const outboundSchema = CreateEdgeConfigResponseBody$outboundSchema;
  /** @deprecated use `CreateEdgeConfigResponseBody$Outbound` instead. */
  export type Outbound = CreateEdgeConfigResponseBody$Outbound;
}
