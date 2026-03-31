/**
 * Node.js polyfills for browser compatibility.
 *
 * vite-plugin-node-polyfills uses esbuild's banner API to inject globals,
 * which is incompatible with Vite 8 (Rolldown replaced esbuild).
 * This file manually reproduces what the plugin did for globals.
 *
 * Required by:
 * - Buffer: Alchemy Account Kit (AA / passkey creation)
 * - process: @1inch/limit-order-sdk and other web3 dependencies
 */
import { Buffer } from 'buffer';
import process from 'process';

globalThis.Buffer = Buffer;
globalThis.process = process;
