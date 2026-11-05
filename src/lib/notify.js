import { toast } from "sonner";

/**
 * Shared notification helpers built on Sonner.
 *
 * Usage for async operations (guarantees exactly one toast per event):
 *
 *   const id = notifyLoading("Deleting studio...");
 *   ...
 *   notifySuccess("Studio deleted!", { id });   // updates the loading toast in place
 *   notifyError("Failed...", { id });           // updates the loading toast in place
 */

export const NETWORK_ERROR_MESSAGE =
  "Network connection error. Please check your internet and try again.";

export const TIMEOUT_ERROR_MESSAGE =
  "The request timed out. Please try again.";

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please login again.";

export const UNAUTHORIZED_MESSAGE =
  "You are not authorized to perform this action.";

export const NOT_FOUND_MESSAGE = "The requested resource was not found.";

export const SERVER_ERROR_MESSAGE =
  "A server error occurred. Please try again later.";

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const INVALID_FORM_MESSAGE =
  "Invalid form data. Please review the form and try again.";

const MAX_MESSAGE_LENGTH = 200;

// Safety net: if a caller ever forgets to resolve a loading toast, it is
// dismissed automatically instead of staying on screen forever.
const LOADING_SAFETY_MS = 60000;
const pendingLoadingTimers = new Map();
let toastCounter = 0;

// Strings that clearly come from stack traces, file paths or server internals.
const STACK_LIKE =
  /\bat\s+\S+\s+\(|node_modules|process\.env|[A-Za-z]:\\[^\s]+|\/(?:app|home|usr|var|etc|src)\/|\.js:\d+|\.ts:\d+|stack trace/i;

// Secret-looking assignments (never show values, but keep the field name).
const SENSITIVE_ASSIGNMENT =
  /((?:password|passwd|secret|token|api[_-]?key|apikey|authorization|bearer|credential|cookie|session[_-]?id)s?\s*[:=]\s*)("?)[^\s"']+/gi;

const NETWORK_PATTERNS = [
  /^failed to fetch$/i,
  /^fetch failed$/i,
  /networkerror/i,
  /network request failed/i,
  /load failed/i,
  /internet connection/i,
];

const TIMEOUT_PATTERNS = [/timeout/i, /timed out/i];

/**
 * Coerce any error/message value into a short, user-safe string.
 * Returns "" when nothing safe can be shown.
 */
export function sanitizeMessage(value) {
  if (value == null) return "";

  const raw =
    typeof value === "string"
      ? value
      : typeof value.message === "string"
        ? value.message
        : "";

  if (!raw) return "";

  // Only ever show the first line: stack traces and multi-line dumps die here.
  const firstLine =
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.length > 0) || "";

  if (!firstLine) return "";

  if (STACK_LIKE.test(firstLine)) return "";

  const single = firstLine.replace(/\s+/g, " ").trim();
  const redacted = single.replace(SENSITIVE_ASSIGNMENT, "$1$2[hidden]");

  if (STACK_LIKE.test(redacted)) return "";

  if (redacted.length > MAX_MESSAGE_LENGTH) {
    return `${redacted.slice(0, MAX_MESSAGE_LENGTH - 1).trimEnd()}…`;
  }

  return redacted;
}

export function isNetworkError(error) {
  const message = typeof error === "string" ? error : error?.message || "";
  return NETWORK_PATTERNS.some((pattern) => pattern.test(message));
}

export function isTimeoutError(error) {
  const name = error?.name || "";
  const message = typeof error === "string" ? error : error?.message || "";
  return (
    name === "TimeoutError" ||
    name === "AbortError" ||
    TIMEOUT_PATTERNS.some((pattern) => pattern.test(message))
  );
}

/** Turn any thrown value into a safe, human readable message. */
export function describeError(error, fallback = GENERIC_ERROR_MESSAGE) {
  if (isNetworkError(error)) return NETWORK_ERROR_MESSAGE;
  if (isTimeoutError(error)) return TIMEOUT_ERROR_MESSAGE;
  return sanitizeMessage(error) || fallback;
}

/**
 * Pick the message for a failed HTTP response.
 * Prefers a safe message from the API, then falls back by status code.
 */
export function apiErrorMessage(status, apiMessage, fallback = GENERIC_ERROR_MESSAGE) {
  if (status === 401) return SESSION_EXPIRED_MESSAGE;

  const safe = sanitizeMessage(apiMessage);
  if (safe) return safe;

  switch (status) {
    case 400:
    case 422:
      return INVALID_FORM_MESSAGE;
    case 403:
      return UNAUTHORIZED_MESSAGE;
    case 404:
      return NOT_FOUND_MESSAGE;
    case 409:
      return "This item already exists. Please try with different details.";
    case 413:
      return "The uploaded content is too large.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return SERVER_ERROR_MESSAGE;
    default:
      if (status >= 500) return SERVER_ERROR_MESSAGE;
      return fallback;
  }
}

function nextId(prefix) {
  toastCounter += 1;
  return `${prefix}-${Date.now()}-${toastCounter}`;
}

function clearSafetyTimer(id) {
  const timer = pendingLoadingTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    pendingLoadingTimers.delete(id);
  }
}

/** Show a loading toast. Returns its id — pass that id to a result helper. */
export function notifyLoading(message, options = {}) {
  const id = options.id ?? nextId("loading");
  clearSafetyTimer(id);

  const { duration, ...rest } = options;
  const shown = sanitizeMessage(message) || "Please wait...";

  toast.loading(shown, { id, ...rest });

  pendingLoadingTimers.set(
    id,
    setTimeout(() => {
      toast.dismiss(id);
      pendingLoadingTimers.delete(id);
    }, duration ?? LOADING_SAFETY_MS)
  );

  return id;
}

export function notifySuccess(message, options = {}) {
  if (options.id) clearSafetyTimer(options.id);
  return toast.success(sanitizeMessage(message) || "Done!", options);
}

export function notifyError(message, options = {}) {
  if (options.id) clearSafetyTimer(options.id);
  return toast.error(sanitizeMessage(message) || GENERIC_ERROR_MESSAGE, {
    duration: 8000,
    ...options,
  });
}

export function notifyWarning(message, options = {}) {
  if (options.id) clearSafetyTimer(options.id);
  return toast.warning(sanitizeMessage(message) || "Please check and try again.", {
    duration: 7000,
    ...options,
  });
}

export function notifyInfo(message, options = {}) {
  if (options.id) clearSafetyTimer(options.id);
  return toast.info(sanitizeMessage(message) || "Please note.", options);
}

export function dismissToast(id) {
  if (!id) return;
  clearSafetyTimer(id);
  toast.dismiss(id);
}

/** Single, de-duplicated session-expired toast (fixed id). */
export function notifySessionExpired() {
  return notifyError(SESSION_EXPIRED_MESSAGE, { id: "session-expired" });
}
