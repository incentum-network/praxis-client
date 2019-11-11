/*
 * Licensed to Incentum Ltd. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Incentum Ltd. licenses this file to you under
 * the Token Use License Version 1.0 and the Token Use
 * Clause (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of
 * the License at
 *
 *  https://github.com/incentum-network/tul/blob/master/LICENSE.md
 *  https://github.com/incentum-network/tul/blob/master/TUC.md
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import axios from 'axios'
import { get } from 'lodash';

import {
  AccountToOutputPayload,
  ActionJson,
  CoinToOutputPayload,
  ContractActionPayload,
  ContractSearchPayload,
  ContractStartPayload,
  EllipticPrivateKey,
  GetContractFromActionPayload,
  GetContractFromInstancePayload,
  GetUnusedOutputsPayload,
  hashJson,
  InputJson,
  InstanceSearchPayload,
  KeyValuePayload,
  MatchSchemasPayload,
  OutputToAccountPayload,
  SaveSchemasPayload,
  SaveTemplatePayload,
  SignatureJson,
  TemplateJson,
} from '@incentum/praxis-interfaces'

import {
  ILedger, IPraxisWallet, ITransactionResult,
} from './interfaces'

import { Identities, Interfaces, Utils } from '@incentum/crypto';
import { 
  AccountToOutputBuilder, 
  CoinToOutputBuilder,
  ContractActionBuilder,
  ContractFromActionBuilder,
  ContractFromInstanceBuilder, 
  ContractSearchBuilder,
  ContractStartBuilder,
  InstanceSearchBuilder,
  MatchSchemasBuilder, 
  OutputToAccountBuilder, 
  SaveSchemasBuilder,
  SaveTemplateBuilder,
  UnusedOutputsBuilder
} from './builders'
import { KeyValueBuilder } from './builders/KeyValueBuilder';

const networks = {
  local: {
    url: 'http://localhost:4003',
  },
  testnet: {
    url: 'https://testnet.incentum.network',
  },
  devnet: {
    url: 'https://devnet.incentum.network',
  },
  mainnet: {
    url: 'https://mainnet.incentum.network',
  }
}

let arkNetwork = 'testnet'
export function arkUrl(): string {
  return networks[arkNetwork].url
}

export function setNetwork(network: string) {
  arkNetwork = network;
}
export function setNetworkUrl(network: string, url: string) {
  arkNetwork = network;
  networks[arkNetwork].url = url
}
const BROADCAST_RETRIES = [8000, 8000, 8000, 8000, 8000, 8000, 8000]
const responseUrl = (address) => `${arkUrl()}/api/v2/wallets/${address}`

const delay = (ms:number) => {
  return new Promise( resolve => setTimeout(resolve, ms))
}

export interface IPraxisResult {
  praxis: IPraxisWallet;
  transactionId: string;
  transactionResult: ITransactionResult;
}

export function signInputs(inputs: InputJson[], ledger: ILedger, action: ActionJson): SignatureJson[] {
  const keyPair: Interfaces.IKeyPair = Identities.Keys.fromPassphrase(ledger.mnemonic);
  const privateKey = new EllipticPrivateKey(keyPair.privateKey)
  return inputs.map((i, idx) => ({ 
    inputKey: i.key,
    ledger: ledger.ledger,
    publicKey: keyPair.publicKey,
    signature: signInputAction(i, idx, action, privateKey),
    actionKey: i.actionKey,
    actionHash: i.actionKey,
    other: {},
  }))
}

export function signInputAction(input: InputJson, idx: number, action: ActionJson, privateKey: EllipticPrivateKey) {
  const formStr = hashJson(action.form)
  const signStr = `${input.outputHash}/${action.type}/${action.contractHash}/${action.nonce}/${idx}/${formStr}`
  return privateKey.sign(signStr)
}

export interface IArkWallet {
  balance: number;
  username: string;
}

export async function getPraxisFromWallet(ledger: ILedger, transaction): Promise<IPraxisResult> {
  let praxis
  const transactionId = await sendTransaction(transaction)
  for (const wait of BROADCAST_RETRIES) {
    await delay(wait)
    praxis = await getResponse(ledger.ledger, transactionId)
    if (praxis.transactionResult) { return praxis }
  }
  return praxis
}

function getPraxisTransaction(praxis: IPraxisWallet, transactionId: string): ITransactionResult {
  const transaction: ITransactionResult[] = praxis.lastTransactions.filter((t) => t.id === transactionId)
  return transaction.length > 0 ? transaction[0] : undefined
}

async function getResponse(address, transactionId): Promise<IPraxisResult> {
  try {
    const response = await axios.get(responseUrl(address))
    const praxis: IPraxisWallet = get(response, 'data.data.praxis')
    const transactionResult = praxis && praxis.lastTransactions ? getPraxisTransaction(praxis, transactionId): undefined
    if (transactionResult) {
      const wallet: IArkWallet = get(response, 'data.data')
      praxis.balance = `${wallet.balance}`
      praxis.username = wallet.username ? `${wallet.username}` : ''
    }
    return { praxis, transactionId, transactionResult }
  } catch (e) {
    return { praxis: undefined, transactionId, transactionResult: undefined }
  }
}

export async function sendTransaction(transaction: Interfaces.ITransactionData): Promise<string | undefined> {
  const response = await axios.post(`${arkUrl()}/api/v2/transactions`, { transactions: [transaction]})
  return transaction.id
}

export function success(result: IPraxisResult): boolean {
  return result.transactionResult && result.transactionResult.status === 0
}

export function failure(result:IPraxisResult): boolean {
  return !success(result)
}

export function failureTransaction(result:IPraxisResult): boolean {
  return !!result.transactionResult
}

export function statusMessage(result:IPraxisResult): string {
  return result.transactionResult && result.transactionResult.messages.length > 0 ? result.transactionResult.messages[0] : ''
}

export function statusMessages(result:IPraxisResult): string[] {
  return result.transactionResult ? result.transactionResult.messages : []
}

export async function txSaveTemplate(template: TemplateJson, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e8 * 1)): Promise<IPraxisResult> {
  const payload = {
      template,
  } as SaveTemplatePayload

  const builder = new SaveTemplateBuilder(fee)
  const transaction = builder
      .saveTemplate(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txAccountToOutput(payload: AccountToOutputPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new AccountToOutputBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txCoinToOutput(payload: CoinToOutputPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new CoinToOutputBuilder(fee)
  const transaction = builder
      .payload(payload)
      // .recipientId(payload.recipientId)
      // .amount(payload.itumAmount)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txKeyValue(payload: KeyValuePayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new KeyValueBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txOutputToAccount(payload: OutputToAccountPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new OutputToAccountBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txSaveSchemas(payload: SaveSchemasPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e8 * 1)): Promise<IPraxisResult> {
  const builder = new SaveSchemasBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txMatchSchemas(payload: MatchSchemasPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new MatchSchemasBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txContractStart(payload: ContractStartPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 5)): Promise<IPraxisResult> {
  payload.action.timestamp = Date.now()
  const builder = new ContractStartBuilder(fee)
  const transaction = builder
      .contractStart(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txContractAction(payload: ContractActionPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 5)): Promise<IPraxisResult> {
  payload.action.timestamp = Date.now()
  const builder = new ContractActionBuilder(fee)
  const transaction = builder
      .contractAction(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txContractSearch(payload: ContractSearchPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new ContractSearchBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txInstanceSearch(payload: InstanceSearchPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new InstanceSearchBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txContractFromAction(payload: GetContractFromActionPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new ContractFromActionBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txContractFromInstance(payload: GetContractFromInstancePayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new ContractFromInstanceBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}

export async function txUnusedOutputs(payload: GetUnusedOutputsPayload, ledger: ILedger, fee: Utils.BigNumber = new Utils.BigNumber(1e7 * 1)): Promise<IPraxisResult> {
  const builder = new UnusedOutputsBuilder(fee)
  const transaction = builder
      .payload(payload)
      .sign(ledger.mnemonic!)
      .getStruct()

  return await getPraxisFromWallet(ledger, transaction)
}
