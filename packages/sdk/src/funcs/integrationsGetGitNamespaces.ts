/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { VercelCore } from "../core.js";
import { encodeFormQuery as encodeFormQuery$ } from "../lib/encodings.js";
import * as m$ from "../lib/matchers.js";
import * as schemas$ from "../lib/schemas.js";
import { RequestOptions } from "../lib/sdks.js";
import { extractSecurity, resolveGlobalSecurity } from "../lib/security.js";
import { pathToFunc } from "../lib/url.js";
import {
  ConnectionError,
  InvalidRequestError,
  RequestAbortedError,
  RequestTimeoutError,
  UnexpectedClientError,
} from "../models/errors/httpclienterrors.js";
import { SDKError } from "../models/errors/sdkerror.js";
import { SDKValidationError } from "../models/errors/sdkvalidationerror.js";
import {
  GitNamespacesRequest,
  GitNamespacesRequest$outboundSchema,
  GitNamespacesResponseBody,
  GitNamespacesResponseBody$inboundSchema,
} from "../models/operations/gitnamespaces.js";
import { Result } from "../types/fp.js";

/**
 * List git namespaces by provider
 *
 * @remarks
 * Lists git namespaces for a supported provider. Supported providers are `github`, `gitlab` and `bitbucket`. If the provider is not provided, it will try to obtain it from the user that authenticated the request.
 */
export async function integrationsGetGitNamespaces(
  client$: VercelCore,
  request: GitNamespacesRequest,
  options?: RequestOptions,
): Promise<
  Result<
    Array<GitNamespacesResponseBody>,
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >
> {
  const input$ = request;

  const parsed$ = schemas$.safeParse(
    input$,
    (value$) => GitNamespacesRequest$outboundSchema.parse(value$),
    "Input validation failed",
  );
  if (!parsed$.ok) {
    return parsed$;
  }
  const payload$ = parsed$.value;
  const body$ = null;

  const path$ = pathToFunc("/v1/integrations/git-namespaces")();

  const query$ = encodeFormQuery$({
    "host": payload$.host,
    "provider": payload$.provider,
    "slug": payload$.slug,
    "teamId": payload$.teamId,
  });

  const headers$ = new Headers({
    Accept: "application/json",
  });

  const bearerToken$ = await extractSecurity(client$.options$.bearerToken);
  const security$ = bearerToken$ == null ? {} : { bearerToken: bearerToken$ };
  const context = {
    operationID: "gitNamespaces",
    oAuth2Scopes: [],
    securitySource: client$.options$.bearerToken,
  };
  const securitySettings$ = resolveGlobalSecurity(security$);

  const requestRes = client$.createRequest$(context, {
    security: securitySettings$,
    method: "GET",
    path: path$,
    headers: headers$,
    query: query$,
    body: body$,
    timeoutMs: options?.timeoutMs || client$.options$.timeoutMs || -1,
  }, options);
  if (!requestRes.ok) {
    return requestRes;
  }
  const request$ = requestRes.value;

  const doResult = await client$.do$(request$, {
    context,
    errorCodes: ["400", "403", "4XX", "5XX"],
    retryConfig: options?.retries
      || client$.options$.retryConfig,
    retryCodes: options?.retryCodes || ["429", "500", "502", "503", "504"],
  });
  if (!doResult.ok) {
    return doResult;
  }
  const response = doResult.value;

  const [result$] = await m$.match<
    Array<GitNamespacesResponseBody>,
    | SDKError
    | SDKValidationError
    | UnexpectedClientError
    | InvalidRequestError
    | RequestAbortedError
    | RequestTimeoutError
    | ConnectionError
  >(
    m$.json(200, z.array(GitNamespacesResponseBody$inboundSchema)),
    m$.fail([400, 403, "4XX", "5XX"]),
  )(response);
  if (!result$.ok) {
    return result$;
  }

  return result$;
}
