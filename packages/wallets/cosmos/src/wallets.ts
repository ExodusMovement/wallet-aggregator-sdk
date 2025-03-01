import { StdSignature } from "@cosmjs/amino";
import {
  DirectSignResponse,
  OfflineDirectSigner,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import Long from "long";
import { ChainInfo } from "./types";

declare global {
  interface Window {
    coin98?: {
      keplr: ExtensionWallet;
    };
    fin?: ExtensionWallet;
    falcon?: ExtensionWallet;
    keplr?: ExtensionWallet;
    leap?: ExtensionWallet;
    compass?: ExtensionWallet;
    $onekey?: {
      cosmos: ExtensionWallet;
    };
  }
}

export interface AccountKey {
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
}

export interface SignDirectParams {
  /** SignDoc bodyBytes */
  bodyBytes?: Uint8Array | null;
  /** SignDoc authInfoBytes */
  authInfoBytes?: Uint8Array | null;
  /** SignDoc chainId */
  chainId?: string | null;
  /** SignDoc accountNumber */
  accountNumber?: Long | null;
}

export interface ExtensionWallet {
  getOfflineSignerAuto: (chainId: string) => Promise<OfflineSigner>;
  getOfflineDirectSigner: (chainId: string) => Promise<OfflineDirectSigner>;
  getOfflineSigner: (chainId: string) => Promise<OfflineDirectSigner>;
  sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: "async" | "sync" | "block"
  ): Promise<Uint8Array>;
  signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature>;
  signDirect(
    chainId: string,
    signer: string,
    signDoc: SignDirectParams
  ): Promise<DirectSignResponse>;
  getKey: (chainId: string) => Promise<AccountKey>;
  experimentalSuggestChain?(chainInfo: ChainInfo): Promise<void>;
}

type LocateFn = () => ExtensionWallet | undefined;

export interface WalletInfo {
  name: string;
  icon: string;
  url: string;
  locate: LocateFn;
}

export const WALLETS: Record<string, WalletInfo> = {
  keplr: {
    name: "Keplr",
    url: "https://www.keplr.app/",
    locate: () => window.keplr,
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQyNV81MTA3KSI+CjxwYXRoIGQ9Ik0zMi40NTQ1IDBIOS41NDU0NUM0LjI3MzY1IDAgMCA0LjI3MzY1IDAgOS41NDU0NVYzMi40NTQ1QzAgMzcuNzI2NCA0LjI3MzY1IDQyIDkuNTQ1NDUgNDJIMzIuNDU0NUMzNy43MjY0IDQyIDQyIDM3LjcyNjQgNDIgMzIuNDU0NVY5LjU0NTQ1QzQyIDQuMjczNjUgMzcuNzI2NCAwIDMyLjQ1NDUgMFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80MjVfNTEwNykiLz4KPHBhdGggZD0iTTMyLjQ1NDUgMEg5LjU0NTQ1QzQuMjczNjUgMCAwIDQuMjczNjUgMCA5LjU0NTQ1VjMyLjQ1NDVDMCAzNy43MjY0IDQuMjczNjUgNDIgOS41NDU0NSA0MkgzMi40NTQ1QzM3LjcyNjQgNDIgNDIgMzcuNzI2NCA0MiAzMi40NTQ1VjkuNTQ1NDVDNDIgNC4yNzM2NSAzNy43MjY0IDAgMzIuNDU0NSAwWiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsXzQyNV81MTA3KSIvPgo8cGF0aCBkPSJNMzIuNDU0NSAwSDkuNTQ1NDVDNC4yNzM2NSAwIDAgNC4yNzM2NSAwIDkuNTQ1NDVWMzIuNDU0NUMwIDM3LjcyNjQgNC4yNzM2NSA0MiA5LjU0NTQ1IDQySDMyLjQ1NDVDMzcuNzI2NCA0MiA0MiAzNy43MjY0IDQyIDMyLjQ1NDVWOS41NDU0NUM0MiA0LjI3MzY1IDM3LjcyNjQgMCAzMi40NTQ1IDBaIiBmaWxsPSJ1cmwoI3BhaW50Ml9yYWRpYWxfNDI1XzUxMDcpIi8+CjxwYXRoIGQ9Ik0zMi40NTQ1IDBIOS41NDU0NUM0LjI3MzY1IDAgMCA0LjI3MzY1IDAgOS41NDU0NVYzMi40NTQ1QzAgMzcuNzI2NCA0LjI3MzY1IDQyIDkuNTQ1NDUgNDJIMzIuNDU0NUMzNy43MjY0IDQyIDQyIDM3LjcyNjQgNDIgMzIuNDU0NVY5LjU0NTQ1QzQyIDQuMjczNjUgMzcuNzI2NCAwIDMyLjQ1NDUgMFoiIGZpbGw9InVybCgjcGFpbnQzX3JhZGlhbF80MjVfNTEwNykiLz4KPHBhdGggZD0iTTE3LjI1MjYgMzIuMjYxNFYyMi41MTkyTDI2LjcxODUgMzIuMjYxNEgzMS45ODQ5VjMyLjAwNzlMMjEuMDk2NCAyMC45MTIyTDMxLjE0NjkgMTAuMzg1N1YxMC4yNjE0SDI1Ljg0NjRMMTcuMjUyNiAxOS41NjM1VjEwLjI2MTRIMTIuOTg0OVYzMi4yNjE0SDE3LjI1MjZaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNDI1XzUxMDciIHgxPSIyMSIgeTE9IjAiIHgyPSIyMSIgeTI9IjQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxRkQxRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMUJCOEZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQxX3JhZGlhbF80MjVfNTEwNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwNjIzIDQwLjQwODYpIHJvdGF0ZSgtNDUuMTU1Nikgc2NhbGUoNjcuMzU0NyA2OC4zNjI0KSI+CjxzdG9wIHN0b3AtY29sb3I9IiMyMzJERTMiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjMyREUzIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDJfcmFkaWFsXzQyNV81MTA3IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDM5LjczNzkgNDEuNzYwMikgcm90YXRlKC0xMzguNDUpIHNjYWxlKDQyLjExMzcgNjQuMjExNikiPgo8c3RvcCBzdG9wLWNvbG9yPSIjOEI0REZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhCNERGRiIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQzX3JhZGlhbF80MjVfNTEwNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyMC42NTAxIDAuMzExNDk4KSByb3RhdGUoOTApIHNjYWxlKDMzLjExMzUgODAuMzQyMykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMjRENUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFCQjhGRiIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNDI1XzUxMDciPgo8cmVjdCB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
  },
  leap: {
    name: "Leap",
    url: "https://www.leapwallet.io/",
    locate: () => window.leap,
    icon: "data:image/png;base64,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",
  },
  falcon: {
    name: "Falcon",
    url: "https://https://www.falconwallet.app/",
    locate: () => window.falcon,
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHQSURBVHgBvZfNTcNAEIXfOI7EkRKSDkIFhAoIFWBEgsgJOogpIScQwYqpAFIBpgM6SErwEck/w9hBCCneNfZu+A62lfVqn3dm3mwIFuD76x666VIeh2gEbwiGbBdP3gDqoTHsOTDFTUftFheS7N1cAPEN2hHRNNy4MIAX46HcemgFh8XVcAfYQztidLJV8aDcAV56h0jdW2jXp6jIZDSFeE0XYawVgKQ7gsMz5ThjRVcLH4aoQ+DwOXQQv8AClT7wbSxr9TQxkHHQhwWqd6CTDaEngiWqBTi5OvbgWAzkDvsSwI+TgdrZJOPz7KQwEFiiVS/gYDwDs5QoHTaamNORVM6HkYDt4vDRmOrEbeSEZXW0WryYTPOqn5tZcX11qEnTVxgL0FaHlkiVuH8WoK+O2tmhauSnF/DT5Qg5q7PayVkuIdrQSVeoEyBft4SjKask7dM0eIZlyhDI9npy09V0ZNN8dgRI5zvVv6aOoSn0n52vCqe2tpmsx/03rmy/5lTLc5oEPvYqIHHPKkcOPuPi3FaefAliQNzbeSfpSmd82MAAbTPS54ed3NA7YTfVnft8WEApoPx6YKCcKX+rsE8BcBMfaqwZk1oA4Vg5ZtGYvgA29askC0E4yAAAAABJRU5ErkJggg==",
  },
  coin98: {
    name: "Coin98",
    url: "https://wallet.coin98.com/",
    locate: () => window.coin98?.keplr,
    icon: "data:image/webp;base64,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",
  },
  onekey: {
    name: "OneKey",
    url: "https://onekey.so/",
    locate: () => window.$onekey?.cosmos,
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF80NTkyMl84OCkiPgo8cGF0aCBkPSJNMTI3LjYxIDYzLjgwNDlDMTI3LjYxIDEwNy44NTMgMTA3Ljg1MyAxMjcuNjEgNjMuODA0OSAxMjcuNjFDMTkuNzU2OCAxMjcuNjEgMCAxMDcuODUzIDAgNjMuODA0OUMwIDE5Ljc1NjggMTkuNzU2OCAwIDYzLjgwNDkgMEMxMDcuODUzIDAgMTI3LjYxIDE5Ljc1NjggMTI3LjYxIDYzLjgwNDlaIiBmaWxsPSIjM0JEMjNEIi8+CjxwYXRoIGQ9Ik02OS41Njk5IDI3LjA1NTdMNTEuODE5NyAyNy4wNTU3TDQ4LjcwNTYgMzYuNDcxOUg1OC41NjQ1TDU4LjU2NDUgNTYuMzA2M0g2OS41Njk5VjI3LjA1NTdaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTg0LjA0ODYgODAuMzExMUM4NC4wNDg2IDkxLjQ5MTIgNzQuOTg1NCAxMDAuNTU0IDYzLjgwNTMgMTAwLjU1NEM1Mi42MjUzIDEwMC41NTQgNDMuNTYyMSA5MS40OTEyIDQzLjU2MjEgODAuMzExMUM0My41NjIxIDY5LjEzMTEgNTIuNjI1MyA2MC4wNjc4IDYzLjgwNTMgNjAuMDY3OEM3NC45ODU0IDYwLjA2NzggODQuMDQ4NiA2OS4xMzExIDg0LjA0ODYgODAuMzExMVpNNzQuODU4NCA4MC4zMTExQzc0Ljg1ODQgODYuNDE1NSA2OS45MDk3IDkxLjM2NDEgNjMuODA1MyA5MS4zNjQxQzU3LjcwMDggOTEuMzY0MSA1Mi43NTIyIDg2LjQxNTUgNTIuNzUyMiA4MC4zMTExQzUyLjc1MjIgNzQuMjA2NiA1Ny43MDA4IDY5LjI1OCA2My44MDUzIDY5LjI1OEM2OS45MDk3IDY5LjI1OCA3NC44NTg0IDc0LjIwNjYgNzQuODU4NCA4MC4zMTExWiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF80NTkyMl84OCI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
  },
};
