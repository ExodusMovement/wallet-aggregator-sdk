import { WalletAdapter } from "@solana/wallet-adapter-base";
import { Connection, Transaction, TransactionSignature } from "@solana/web3.js";
import { ChainId, CHAINS, SendTransactionResult, Signature, Wallet, WalletState } from "@xlabs-libs/wallet-aggregator-core";

export interface SolanaAdapter extends WalletAdapter {
  signTransaction?<T extends Transaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions?<T extends Transaction>(
      transactions: T[]
  ): Promise<T[]>;
  signMessage?(message: Uint8Array): Promise<Uint8Array>;
}

export type SolanaUnsignedTransaction = Transaction | Transaction[];
export type SolanaSignedTransaction = Transaction | Transaction[];
export type SolanaSubmitTransactionResult = TransactionSignature | TransactionSignature[];
export type SolanaMessage = Uint8Array;

export interface SolanaNetworkInfo {
}

export class SolanaWallet extends Wallet<
  SolanaUnsignedTransaction,
  SolanaSignedTransaction,
  SolanaSubmitTransactionResult,
  SolanaNetworkInfo,
  SolanaMessage
> {
  constructor(
    private readonly adapter: SolanaAdapter,
    private readonly connection: Connection
  ) {
    super();
  }

  getAdapter(): SolanaAdapter {
    return this.adapter;
  }

  getName(): string {
    return this.adapter.name;
  }

  getUrl(): string {
    return this.adapter.url;
  }

  async connect(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.adapter.on('connect', () => {
        this.adapter.off('connect');
        this.adapter.off('error');

        resolve(this.getAddresses());
        this.emit('connect');
      });

      this.adapter.on('error', () => {
        this.adapter.off('connect');
        this.adapter.off('error');
        reject();
      });

      this.adapter.connect();
    });
  }

  getNetworkInfo(): SolanaNetworkInfo | undefined {
    // TODO: investigate whether there is a way to retrieve the current network
    // See: https://solana.stackexchange.com/questions/141/what-method-should-a-dapp-use-to-detect-a-change-in-wallet-network-for-any-walle/309?noredirect=1#comment366_309
    return {};
  }

  isConnected(): boolean {
    return this.adapter.connected;
  }

  async disconnect(): Promise<void> {
    await new Promise((resolve, reject) => {
      this.adapter.on('disconnect', () => {
        this.adapter.off('disconnect');
        this.adapter.off('error');
        resolve(undefined);
      });

      this.adapter.on('error', () => {
        this.adapter.off('disconnect');
        this.adapter.off('error');
        reject();
      });

      this.adapter.disconnect();
    });

    this.emit('disconnect');
  }

  getChainId(): ChainId {
    return CHAINS['solana'];
  }

  getAddress(): string | undefined {
    return this.adapter.publicKey?.toString();
  }

  getAddresses(): string[] {
    const address = this.getAddress()
    return address ? [ address ] : []
  }

  setMainAddress(address: string): void {
    throw new Error('Not supported')
  }

  getBalance(): Promise<string> {
    throw new Error("Not supported")
  }

  signTransaction(tx: Transaction): Promise<Transaction>;
  signTransaction(tx: Transaction[]): Promise<Transaction[]>;
  signTransaction(tx: SolanaUnsignedTransaction): Promise<SolanaSignedTransaction> {
    if (!this.adapter.signTransaction || !this.adapter.signAllTransactions) throw new Error('Not supported');
    return Array.isArray(tx) ? this.adapter.signAllTransactions(tx) : this.adapter.signTransaction(tx)
  }

  sendTransaction(tx: Transaction): Promise<SendTransactionResult<TransactionSignature>>;
  sendTransaction(tx: Transaction[]): Promise<SendTransactionResult<TransactionSignature[]>>;
  async sendTransaction(toSign: SolanaSignedTransaction): Promise<SendTransactionResult<SolanaSubmitTransactionResult>> {
    const txs = Array.isArray(toSign) ? toSign : [ toSign ]

    if (txs.length === 0) {
      throw new Error('Empty transactions array')
    }

    const ids: TransactionSignature[] = []
    for (const tx of txs) {
      const id = await this.adapter.sendTransaction(tx, this.connection);
      ids.push(id)
    }

    await this.connection.confirmTransaction(ids[0]);

    return {
      id: ids[0],
      data: ids.length === 1 ? ids[0] : ids
    }
  }

  signMessage(msg: SolanaMessage): Promise<Signature> {
    if (!this.adapter.signMessage) throw new Error('Not supported');
    return this.adapter.signMessage(msg);
  }

  getIcon(): string {
    return this.adapter.icon;
  }

  getWalletState(): WalletState {
    const state = this.adapter.readyState;
    if (!(state in WalletState)) {
      throw new Error(`Unknown wallet state ${state}`);
    }
    return WalletState[state];
  }
}
