import { resolve } from "path";

export const SLA_CONSTANTS = {
    response: {P1: 15 * 60 * 1000, P2: 60 * 60 * 1000, P3: 4*60 * 60 * 1000, P4: 24*60 * 60 * 1000}, // in milliseconds
    resolve: {P1: 4*60 * 60 * 1000, P2: 8*60 * 60 * 1000, P3: 3*24*60 * 60 * 1000, P4: 7*24*60 * 60 * 1000}  // in milliseconds
}as const;