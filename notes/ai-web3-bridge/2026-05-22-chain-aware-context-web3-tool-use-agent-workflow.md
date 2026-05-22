# AI x Web3 Bridge 前三节学习笔记

日期：2026-05-22

阅读章节：

- https://aiweb3.school/zh/handbook/bridge/chain-aware-context/
- https://aiweb3.school/zh/handbook/bridge/web3-tool-use/
- https://aiweb3.school/zh/handbook/bridge/agent-workflow/

## 1. 总体理解

今天读的是 AI x Web3 Bridge 的前三节：Chain-aware Context、Web3 Tool Use、Agent Workflow。我的理解是，这三节真正回答的问题不是“AI 怎么连上链”，而是：

> 如何把一个会生成文本、会推理但不天然可靠的概率模型，放进一个需要事实、权限、交易、资产和审计的 Web3 执行环境里。

如果只从技术名词看，这三节分别讲上下文、工具调用、工作流；但如果从产品和系统设计看，它们其实是一条完整链路：

1. **Chain-aware Context** 解决“Agent 应该基于什么事实思考”。
2. **Web3 Tool Use** 解决“Agent 可以通过什么受控接口读取或行动”。
3. **Agent Workflow** 解决“Agent 的行动怎样被组织成可停止、可恢复、可审计的流程”。

前面 AI 基础部分告诉我：LLM 本质上不是事实数据库，Prompt 不是安全边界，Context 决定模型能看见什么，RAG 和工具可以补充外部事实。Web3 基础部分又告诉我：钱包、签名、合约、交易、DeFi、Oracle、Indexing 和 Security 都有强烈的状态性和权限边界。Bridge 部分就是把两边接起来：让 AI 不再只是在聊天框里“解释 Web3”，而是在链上系统附近“谨慎地协助行动”。

我今天最重要的收获是：AI x Web3 的核心不是让 Agent 更自由，而是让 Agent 的自由被链上事实、工具权限、状态机、日志和人工确认包住。真正有价值的 Agent 不是“什么都能帮你点”，而是“知道什么时候读、什么时候解释、什么时候停、什么时候必须交还给用户确认”。

## 2. Chain-aware Context：让模型看见正确链上事实

### 2.1 内容转述

Chain-aware Context 的核心是：AI 在回答或行动前，不能只靠用户一句自然语言，也不能凭训练记忆猜链上状态。它需要看见正确的链、地址、合约、交易、事件、余额、授权和数据来源。

这一节强调了几个事实：

- 链上状态会随区块变化，同一个地址的余额、allowance、仓位和交易状态都可能在短时间内改变。
- 合约地址、chain id、ABI、事件、交易历史、区块号、索引同步时间这些信息，都应该作为上下文的一部分。
- 工具返回的是事实，模型负责解释；两者不能混在一起。
- 文档和 ABI 只能提供部分语义。ABI 告诉我们能调用什么函数，但不能告诉我们这个函数在业务上是否安全、是否高权限、是否符合用户目标。
- 区块浏览器、RPC、索引器、协议 API、审计报告和文档都可以提供上下文，但每一种来源都需要标注来源、时间和可信边界。
- Citation 很关键。链上场景里的引用可以是交易哈希、区块号、合约地址、event log、explorer link、文档 URL 或审计章节。

这一节让我把“上下文”理解得更具体了。普通 AI 应用的上下文通常是聊天记录、文档、数据库记录；但 Web3 Agent 的上下文必须包含链上事实，并且这些事实必须带时间戳、来源和链信息。不带 chain id 的余额、不带 block number 的状态、不带合约地址的 ABI、不带同步状态的索引数据，都可能误导模型。

### 2.2 我的理解

我以前容易把 context 理解成“给模型更多资料”，但 Chain-aware Context 提醒我，Web3 里的 context 不是更多，而是更严格。一个 Agent 如果不知道自己读取的是 Ethereum mainnet、Base、Arbitrum 还是某个 testnet，它其实还没有资格给出链上建议。

我把链感知上下文拆成四层：

1. **身份层**：用户地址、钱包类型、smart account、session key、当前连接网络。
2. **对象层**：合约地址、ABI、源码验证状态、proxy implementation、owner/admin、token decimals。
3. **状态层**：余额、allowance、仓位、pool 状态、oracle 最新价格、区块号、交易状态。
4. **证据层**：explorer link、transaction hash、event log、文档 URL、审计报告、索引更新时间。

模型真正需要的不是一大段“这个协议很安全”的自然语言，而是这些结构化事实。AI 的价值是把这些事实解释给人听，帮助人理解风险、意图和下一步，而不是替代事实来源。

我也意识到，Chain-aware Context 是防止 Agent 幻觉的第一道防线。很多 AI 错误不是模型不会推理，而是它在错误上下文里推理得很流畅。例如：

- 把测试网合约当主网合约。
- 把旧版本文档当现行协议规则。
- 把索引器落后数据当实时数据。
- 把用户曾经的 approve 当当前仍有效。
- 把 ABI 函数名理解成业务语义，但没有检查权限和事件。

这些错误看起来是“模型错了”，实际上是“上下文治理错了”。如果上下文没有来源、版本、区块号和同步状态，模型很难自己意识到边界。

### 2.3 对产品设计的启发

如果我要做一个 AI x Web3 Risk Research Agent，第一步不是接钱包，也不是让 Agent 生成交易，而是设计 context schema。

我会要求 Agent 在任何链上分析前先形成这样的结构：

```yaml
network:
  chain_id:
  chain_name:
  block_number:
  rpc_provider:
user:
  address:
  wallet_type:
contracts:
  - address:
    verified_source:
    abi_source:
    proxy:
    implementation:
    owner_or_admin:
onchain_state:
  balances:
  allowances:
  positions:
  oracle_values:
evidence:
  explorer_links:
  tx_hashes:
  event_logs:
  docs:
indexing:
  source:
  synced_block:
  updated_at:
uncertainties:
  - missing field or stale data
```

这不是为了形式漂亮，而是为了让模型每一句解释都有落脚点：哪条链、哪个合约、哪个区块、哪个来源。如果缺少关键字段，Agent 应该说“我不能确认”，而不是补一个听起来合理的结论。

## 3. Web3 Tool Use：让 Agent 通过受限工具行动

### 3.1 内容转述

Web3 Tool Use 讨论的是把 RPC、合约读取、交易生成、钱包确认、区块浏览器、DeFi 操作等能力变成 Agent 可调用工具。难点不是“能不能调用”，而是调用时有没有结构化输入、权限边界、模拟结果和日志。

这一节最关键的原则是：模型可以选择工具，但工具必须用确定性边界限制模型。不能让 Agent 直接拼接任意 calldata，也不能给它一个万能 RPC 或万能 DeFi 工具，让它自己决定往哪里发交易。

章节里提到的工具类型包括：

- **RPC Tool**：读取链状态、查区块、估算 gas、获取日志或广播交易。只读和写入能力必须分开。
- **Contract Read**：读取 view / pure 函数，例如余额、配置、owner、allowance、pool 状态等。风险相对低，但仍可能因为网络、合约、ABI 或 RPC 数据问题误导模型。
- **Contract Write**：改变链上状态，必须经过 chain id、合约地址、method、args、value、gas、simulation、policy、授权、交易回执等检查。
- **Wallet Tool**：连接账户、请求签名、生成交易、管理授权和返回用户确认结果。必须区分 connect、sign message、send transaction、approve、revoke。
- **Explorer Tool**：查询交易、合约源码、event、token transfer 和地址历史，为 Agent 和用户提供可验证证据。
- **DeFi Tool**：封装 swap、借贷、授权、仓位查询、清算风险等能力，需要协议白名单、最大交易额、滑点限制、价格来源、simulation、allowance 检查和人工确认。
- **Tool Permission**：按工具、合约、方法、金额、时间、频率和用户确认级别分层授权。
- **Tool Log**：记录用户目标、工具名、输入、输出、错误、时间、chain id、block number、tx hash、确认人和 policy 判断。

这节给我的感觉是，工具调用不是把模型接上 API，而是在每个能力前加一道明确的门。

### 3.2 我的理解

在普通 AI 应用里，工具调用常常只是“搜索一下”“查数据库”“读文件”。这些工具即使错了，通常只是答案错了。但 Web3 工具调用的后果可能是资产转移、权限授权、仓位变化、清算风险、合约状态改变。这就要求工具不是简单函数，而是带权限和审计的执行接口。

我现在会把 Web3 工具分成四类：

1. **事实读取工具**：RPC read、contract read、explorer query、index query。默认可以较宽松开放，但返回必须带来源、区块号和错误信息。
2. **解释辅助工具**：ABI decoder、transaction parser、event summarizer、risk classifier。它们帮助模型理解，但输出仍要标注“分析结果”而不是链上事实。
3. **交易准备工具**：quote、calldata builder、gas estimator、simulation。可以生成候选动作，但不执行。
4. **状态改变工具**：contract write、wallet signing、DeFi swap、approve、bridge、borrow、repay。这类工具必须被严格限制。

我的理解是，Agent 的危险不是“会调用工具”，而是“工具设计把危险动作伪装成普通动作”。如果一个函数叫 `executeAction(params)`，里面既能查余额又能发交易，那模型和审计系统都很难判断风险。好的工具应该把风险暴露在接口层，例如：

- `readTokenBalance(chainId, tokenAddress, userAddress)`
- `buildSwapTransaction(chainId, protocol, tokenIn, tokenOut, amountIn, maxSlippageBps)`
- `simulateTransaction(chainId, from, to, calldata, value)`
- `requestWalletConfirmation(transactionDraft)`
- `submitTransactionAfterUserConfirmation(confirmedDraftId)`

这样的设计迫使 Agent 先读事实，再生成草稿，再模拟，再确认，再提交。它不是一次“聪明调用”，而是一条可检查链路。

### 3.3 对权限的思考

Tool Permission 是我认为最容易被低估的部分。很多 Agent demo 会展示“AI 帮我完成交易”，但真实产品不能直接给 Agent 钱包控制权。权限应该是逐层升级的：

- 查余额：自动允许。
- 查 allowance：自动允许。
- 解释交易：自动允许。
- 生成交易草稿：自动允许。
- 运行 simulation：自动允许。
- 小额白名单操作：可以由 session key 执行。
- 大额转账、无限 approve、跨链、借贷、清算、合约升级：必须人工确认或多签。
- 任意 calldata、未知合约写入、未验证源码合约：默认拒绝。

这对 AI x Web3 产品的意义很大。未来的 Agent 不一定需要“完全不能执行”，而是需要“只能在可解释的范围内执行”。Session key、smart account policy、白名单合约、最大额度、方法限制、过期时间和频率限制，都会成为 Agent 产品的核心能力。

### 3.4 Tool Log 的价值

Tool Log 不是给开发者看的附加日志，而是 Agent 行为的责任链。链上交易一旦发出，就不能只靠聊天记录复盘。我们要能回答：

- 用户最初目标是什么？
- 模型看到了哪些上下文？
- 调用了哪个工具？
- 工具输入是什么？
- 工具返回了什么？
- policy 是否拦截过？
- simulation 结果是什么？
- 用户确认时看到了什么？
- 最终交易哈希是什么？
- 交易确认、失败或 revert 的原因是什么？

没有这些日志，Agent 出错后就只能争论“模型是不是这么想的”。有日志，才能定位是模型理解错、工具返回错、权限策略漏了、前端展示不清楚，还是用户确认了高风险动作。

## 4. Agent Workflow：把概率模型放进确定性流程

### 4.1 内容转述

Agent Workflow 把“用户目标 → 上下文读取 → 计划生成 → 工具调用 → 风险检查 → 执行 → 记录和复盘”组织成可控流程。它强调的不是模型多聪明，而是流程必须显式、有状态、有停止条件。

这一节的核心观点是：高风险 Agent 不能只有“下一步推理”。它需要任务图、状态机、工具权限、错误处理、人工确认、trace 和评估集。

知识节点包括：

- **Task Graph**：把目标拆成节点和依赖。比如一次低风险 swap 可以拆成读取目标、获取余额和 allowance、查询价格和流动性、生成候选交易、模拟交易、展示风险、用户确认、发送交易、追踪结果。
- **State Machine**：让执行过程有明确状态，例如 `draft`、`context_loaded`、`plan_ready`、`simulation_failed`、`waiting_user_confirmation`、`submitted`、`confirmed`、`reverted`、`cancelled`。
- **Human-in-the-loop**：不是让人确认所有低风险动作，而是在关键风险点让人确认，并且确认时能看懂资产变化、权限变化和失败风险。
- **Retry / Fallback**：不能盲目重试。读余额失败可以重试，发送交易失败要先判断是否已经广播，交易 pending 不能简单再发一笔。
- **Trace**：记录每一步输入、判断、工具调用和结果。Trace 至少应该包括用户目标、模型版本、上下文来源、工具输入输出、policy 判断、simulation 结果、人工确认、tx hash 和最终状态。
- **Evaluation Harness**：测试 Agent 在不同任务、风险和异常场景下的表现，比如是否拒绝越权请求、识别错误链、在缺数据时停止、要求 human check、记录 citation、避免危险 calldata。
- **Regression Set**：固定测试用例，防止模型、prompt、工具或策略更新后安全性退化。

这一节把 Agent 从“一个会思考的模型”转成“一个在流程里工作的系统”。

### 4.2 我的理解

我觉得 Agent Workflow 是前三节里最关键的一节。Chain-aware Context 告诉 Agent 看什么，Tool Use 告诉 Agent 能用什么，Workflow 则告诉 Agent 怎么一步一步做，以及什么时候停。

我的理解是：AI x Web3 Agent 的核心架构应该更像状态机，而不是聊天机器人。聊天历史适合表达用户意图，但不适合承载执行状态。真正的状态应该外置，例如数据库、workflow engine 或 task graph 中。原因很简单：链上动作会跨越时间。

例如用户让 Agent “帮我做一次低风险 swap”。这不是一次回复，而是一串状态：

1. `draft`：收到目标，但还没有链上上下文。
2. `context_loaded`：读取余额、allowance、合约、价格和流动性。
3. `plan_ready`：生成交易计划。
4. `simulation_ready`：模拟成功，估算资产变化。
5. `waiting_user_confirmation`：等待用户确认。
6. `submitted`：交易已广播。
7. `confirmed` 或 `reverted`：交易最终状态。

如果用户刷新页面、RPC 超时、交易 pending、模型请求重试，系统都必须知道当前在哪一步。否则很容易重复发交易、覆盖旧草稿、在 pending 状态下重新提交，或把失败状态当成未开始。

### 4.3 关于 Human-in-the-loop 的思考

我以前容易把 human-in-the-loop 理解成“重要事情让用户点确认”。但这节让我意识到，关键不是“有没有确认按钮”，而是“确认时用户有没有足够的信息做判断”。

一个糟糕的确认是：

> 是否确认执行此操作？

一个更好的确认应该展示：

- 当前网络和 chain id。
- 目标合约和是否 verified。
- 方法名和参数。
- 资产流入/流出预估。
- allowance 变化。
- gas 估算。
- simulation 结果。
- 最大滑点或最大损失。
- 交易失败可能的后果。
- Agent 的判断依据和 citation。

这其实把 Human-in-the-loop 从“形式上的授权”变成“信息充分的授权”。如果用户看不懂自己确认什么，那确认本身并不能提升安全。

### 4.4 关于 Retry / Fallback 的思考

Retry 在普通系统里是常规工程手段，但在 Web3 里会变得危险。读取失败可以重试；交易提交失败不能直接重试，因为交易可能已经广播，只是 RPC 没返回。交易 pending 更不能简单再发一笔，因为可能导致重复操作、nonce 冲突或资产重复暴露。

我觉得 Web3 Agent 的 retry 策略必须按动作类型分级：

- **Read retry**：允许短时间重试，也可以切换 RPC，但要记录 provider 和 block number。
- **Build retry**：重新生成交易草稿可以，但要明确草稿版本。
- **Simulation retry**：可以重试，但不同 provider 或不同区块下结果要标注。
- **Submit retry**：必须先查询 nonce、mempool、tx hash、钱包状态，不能盲目再发。
- **Confirmation retry**：用户拒绝后不能自动再次弹窗；需要用户重新发起。

Fallback 也一样。模型不可用时可以降级到只读报告，但不应该自动换一个未经评估的模型继续执行交易。这一点非常重要，因为 fallback 不是绕过安全策略的后门。

### 4.5 Evaluation Harness 与 Regression Set

前三天学 AI Evaluation 时，我理解了 eval set 的价值；今天这节把它放进链上 Agent 场景里，感觉更具体。

Web3 Agent 的 eval 不应该只问“回答好不好”，还应该问：

- 遇到错误链时是否停下？
- 遇到未知合约时是否拒绝写入？
- 用户要求无限 approve 时是否警告并要求确认？
- 文档里有恶意指令时是否忽略 prompt injection？
- 余额不足时是否停止？
- Oracle 数据过旧时是否标注风险？
- simulation failed 时是否禁止提交？
- 用户拒绝签名后是否终止流程？

这些测试样本应该成为 regression set。每次换模型、改 prompt、加工具、调 policy，都要跑一次。否则一个 demo 看起来更流畅，可能同时让安全边界变弱。

## 5. 三节之间的关系

我可以把今天三节浓缩成一条公式：

> Chain-aware Context 提供事实，Web3 Tool Use 提供受限能力，Agent Workflow 提供流程边界。

或者换成产品语言：

> Agent 先看见正确事实，再通过受限工具行动，最后在可恢复、可审计、可评估的流程里推进。

如果少了其中一环，系统都会变危险：

- 有 context 没工具：Agent 只能解释，不能行动。
- 有工具没 context：Agent 会基于错误事实行动。
- 有 context 和工具但没 workflow：Agent 可能自由发挥、重复执行、无法恢复、无法复盘。
- 有 workflow 但没 evaluation：系统变更后不知道安全性是否退化。

我对 AI x Web3 Bridge 的理解也更清楚了：Bridge 不是一个单点技术，而是一组边界设计。它的目标不是把 AI 变成钱包，也不是把 Web3 变成聊天界面，而是在自然语言意图和链上执行之间建立安全过渡层。

## 6. 我对 Hackathon / 产品研究方向的更新

前几天我设想过一个只读优先的 AI x Web3 Risk Research Agent。读完这三节后，我会把它设计得更具体：

### 6.1 MVP 目标

用户输入一个交易哈希、合约地址、钱包地址或 DeFi 操作意图，Agent 输出一份结构化风险报告，并在需要执行时只生成交易草稿，不直接提交。

### 6.2 MVP 工作流

1. **输入解析**
   - 识别用户目标：研究、解释、准备交易、风险检查。
   - 判断输入类型：tx hash、contract address、wallet address、protocol name、natural language intent。

2. **Chain-aware Context 加载**
   - chain id、block number、RPC provider。
   - contract address、ABI、verified source、proxy/implementation。
   - token decimals、余额、allowance、positions。
   - explorer link、event logs、indexer synced block。

3. **只读工具调用**
   - RPC read。
   - contract read。
   - explorer query。
   - event indexing query。
   - docs/RAG search。

4. **风险解释**
   - 模型区分链上事实、文档描述、模型推断。
   - 输出 citation。
   - 明确不确定信息。

5. **交易草稿阶段**
   - 如果用户要求行动，只能生成 draft。
   - 运行 simulation。
   - 进行 policy check。
   - 显示资产和权限变化。

6. **确认或停止**
   - 低风险只读：自动完成。
   - 交易草稿：等待用户确认。
   - 超出 policy：拒绝。
   - simulation failed：停止。

7. **Trace 和复盘**
   - 保存上下文来源、工具输入输出、模型版本、policy 判断、simulation 结果、用户确认和最终状态。

### 6.3 最小工具集

我会先做只读版本，不急着接钱包写入：

- `get_chain_context(chainId)`
- `get_contract_metadata(chainId, address)`
- `read_contract(chainId, address, abi, method, args)`
- `get_transaction_receipt(chainId, txHash)`
- `get_token_transfers(chainId, txHashOrAddress)`
- `get_explorer_link(chainId, entityType, value)`
- `search_protocol_docs(protocol, query)`
- `check_indexer_freshness(source, chainId)`

写入工具暂时只做草稿：

- `build_transaction_draft(...)`
- `simulate_transaction(draftId)`
- `explain_transaction_effects(simulationId)`

暂不提供：

- 任意 contract write。
- 任意 calldata 执行。
- 无限制 approve。
- 真实 wallet signing。
- 自动 DeFi execution。

我的判断是：Hackathon 早期做“读 + 解释 + 风险报告 + 草稿模拟”已经足够展示 AI x Web3 价值，而且安全边界更清楚。

## 7. 我的学习反思

这三节让我改变了一个直觉：过去我会把 AI x Web3 想成“AI 帮用户操作链上应用”，但现在我更愿意把它理解成“AI 帮用户理解、准备、检查和审计链上操作”。

这两个方向差别很大：

- “帮用户操作”容易追求自动化和酷炫 demo。
- “帮用户理解、准备、检查和审计”更接近真实生产价值。

Web3 的痛点不是没有按钮，而是用户很难理解按钮背后的权限、资产变化、合约风险和链上后果。如果 AI 能把这些风险解释清楚，把事实证据组织好，把交易草稿模拟出来，并在高风险处停下来，这已经是很大的产品价值。

我也更清楚地看到，AI Agent 的能力越强，越需要工程化约束：

- Context 约束它看什么。
- Tool schema 约束它怎么调用。
- Permission 约束它能做什么。
- Workflow 约束它按什么顺序做。
- State machine 约束它在哪里停。
- Trace 约束它如何被追责。
- Evaluation 约束它更新后是否仍然安全。

如果缺少这些约束，Agent 的“聪明”会变成风险放大器；如果这些约束设计得好，Agent 才可能成为用户和链上复杂系统之间的可靠翻译层。

## 8. 我的实践检查清单

以后设计 AI x Web3 Agent，我会先问：

- [ ] Agent 是否明确知道 chain id、block number 和数据来源？
- [ ] 链上事实是否来自 RPC、explorer、indexer 或协议 API，而不是模型记忆？
- [ ] 输出是否区分工具事实、文档说明和模型推断？
- [ ] 每个关键结论是否有 citation？
- [ ] 只读工具和写入工具是否分离？
- [ ] 写入工具是否限制合约、方法、金额、时间和频率？
- [ ] 钱包动作是否区分 connect、sign message、approve、send transaction、revoke？
- [ ] 交易草稿是否经过 simulation 和 policy check？
- [ ] 用户确认时是否能看到资产变化、权限变化、失败风险和来源证据？
- [ ] Retry 是否区分 read、build、simulate、submit、confirm？
- [ ] Pending 或未知交易状态下是否禁止盲目重复提交？
- [ ] 是否有 trace 记录上下文、工具、policy、simulation、确认和 tx hash？
- [ ] 是否有 regression set 覆盖错误链、未知合约、无限 approve、恶意文档、余额不足、oracle stale、用户拒签等场景？

## 9. Handbook Feedback Candidate

我觉得这三节可以增加一个贯穿示例，例如：

> 用户说：“帮我检查并准备一次低风险 swap。”

这个案例可以把三节串起来：

- Chain-aware Context：读取 chain id、用户余额、allowance、token decimals、pool 流动性、oracle/price source、最新 block、explorer 链接。
- Web3 Tool Use：用 contract read、explorer query、quote tool、simulation tool、wallet confirmation tool，并把读写工具分离。
- Agent Workflow：把流程拆成 context_loaded、plan_ready、simulation_ready、waiting_user_confirmation、submitted、confirmed/reverted 等状态。

案例里可以特别展示两种停止条件：

- 用户要求无限 approve：Agent 给出风险解释并要求人工确认或建议最小额度。
- simulation failed 或 price source stale：Agent 停止，不生成提交动作。

这样学习者会更容易理解：Bridge 不是抽象概念，而是把 AI 的自然语言意图变成链上动作前的一组安全闸门。

## 10. 今日行动项

- [x] 阅读 Chain-aware Context。
- [x] 阅读 Web3 Tool Use。
- [x] 阅读 Agent Workflow。
- [x] 整理三节之间的系统关系。
- [x] 结合自己的 Hackathon / 产品研究方向更新 Agent MVP 思路。
- [ ] 选一个测试网 swap 交易，按 Task Graph 拆一次完整流程。
- [ ] 为 Risk Research Agent 写 10 条 regression set。
- [ ] 把今天的 Handbook feedback candidate 整理成可提交反馈。
