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

export enum TransactionTypes {
    ContractStart = 100,
    ContractAction = 101,
    SaveTemplate = 102,
    InstanceSearch = 103,
    ContractSearch = 104,
    SaveSchemas = 105,
    MatchSchemas = 106,
    ContractFromAction = 107,
    ContractFromInstance = 108,
    UnusedOutputs = 109,
    AccountToOutput = 110,
    OutputToAccount = 111,
    CoinToOutput = 112,
    KeyValue = 113,
}
