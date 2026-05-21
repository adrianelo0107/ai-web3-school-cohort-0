# Web3 基础全章学习笔记

日期：2026-05-21

来源：

- https://aiweb3.school/zh/handbook/web3/cryptography/
- https://aiweb3.school/zh/handbook/web3/wallet/
- https://aiweb3.school/zh/handbook/web3/smart-contract/
- https://aiweb3.school/zh/handbook/web3/dev-stack/
- https://aiweb3.school/zh/handbook/web3/network/
- https://aiweb3.school/zh/handbook/web3/account-abstraction/
- https://aiweb3.school/zh/handbook/web3/defi/
- https://aiweb3.school/zh/handbook/web3/oracle/
- https://aiweb3.school/zh/handbook/web3/indexing/
- https://aiweb3.school/zh/handbook/web3/security/

## 1. 总结

Web3 基础不是一组孤立概念，而是一条从“控制权”到“可验证执行”的系统链路：

- **密码学** 定义身份、签名、哈希和证明的底层边界。
- **钱包** 是用户意图进入链上执行前的确认入口。
- **智能合约** 把规则、资产和状态放进公开可验证的执行环境。
- **开发栈** 让合约开发、测试、部署、前端调用和链上验证可复现。
- **网络** 决定交易如何传播、打包、确认，以及 L1/L2/测试网的环境差异。
- **账户抽象** 把账户从单一私钥扩展成可编程权限系统。
- **DeFi** 把 token、流动性、借贷、稳定币和价格机制组合成开放金融协议。
- **预言机** 把链外数据带入链上，同时引入新的信任边界。
- **索引** 把原始区块、交易和事件整理成产品与 AI Agent 可用的数据层。
- **安全** 把权限、测试、模拟、监控和应急响应贯穿整个系统。

对 AI x Web3 来说，今天最重要的收获是：Agent 不能只“理解 Web3 概念”，它必须尊重 Web3 的执行边界。模型可以解释、检索、生成计划和辅助判断，但私钥、签名、资产转移、合约调用、授权、升级、清算、预言机依赖和高风险交易都必须由工具事实、策略约束、模拟结果和人工确认共同控制。

## 2. 密码学：链上控制权的根

密码学是 Web3 账户、地址、签名、所有权和证明的基础。这里不需要先成为密码学研究者，但必须理解几个产品边界：

- **Hash** 是数据指纹和承诺，用来验证数据是否被改过。交易哈希、区块哈希、合约字节码哈希都属于这类可验证标识。Hash 不是加密，通常不能从哈希反推出原文。
- **Public Key / Address** 可以公开，用来验证签名或定位账户，但地址本身不是“可信身份”。一个地址是否可信，取决于来源、验证信息和上下文。
- **Private Key** 是账户控制权。泄漏私钥或助记词，不是“密码泄漏后改密码”的问题，而是资产和权限可能直接失控。
- **Signature** 是对具体消息或交易内容的授权证明，不应该被产品包装成含糊的“登录确认”。
- **Merkle Tree** 用哈希组织大量数据，让用户用少量 proof 证明某条数据属于某个集合。

我需要形成的习惯：看到签名弹窗时，先问它在证明身份、授权登录，还是在授权资产或改变链上状态。任何要求把私钥、助记词、签名原文或钱包控制材料交给网页、脚本、客服、AI 工具的流程，都应该默认视为高风险。

## 3. 钱包：不是登录按钮，而是确认边界

钱包管理的不是账号资料，而是链上控制权。Web3 产品里常见的动作需要明确拆开：

- **连接钱包**：应用读取地址、网络、账户状态，不等于可以动用资产。
- **签名消息**：用户证明自己控制某地址，可能用于登录、订单创建或授权。
- **发送交易**：用户请求改变链上状态，可能涉及转账、approve、合约调用、gas 支付。

这三类动作的风险完全不同，UI、文案和确认提示也应该不同。钱包交互的基本要求是：用户应该知道自己在哪条链、调用哪个合约、授权什么资产、费用用什么支付、失败后是否可恢复。

关键概念：

- **EOA** 是由私钥控制的外部账户，兼容性好但权限粗、恢复难、自动化弱。
- **Mnemonic** 是恢复钱包的高风险秘密，不应被任何应用索要。
- **Transaction** 是正式的链上状态变更请求，要经历钱包确认、签名、广播、打包、执行和确认。
- **Gas** 是链上执行成本，用户需要知道大致费用、失败成本和重试路径。
- **Explorer** 是查看链上事实的重要入口，应检查 status、from/to、method、value、token transfers、logs、gas used。

AI Agent 可以帮助解释交易、准备参数和检查风险，但签名和权限不能随意交给模型。更稳妥的设计是：AI 做理解和辅助，钱包做确认和授权，智能账户或策略合约做执行约束。

## 4. 智能合约：公开可验证的规则系统

智能合约不是“自动执行的法律合同”，而是部署在链上的程序。它把规则、资产和状态放到公开环境里，也把 bug、权限和升级风险暴露给所有人。

核心理解：

- 合约的价值来自可验证执行，不是代码看起来聪明。
- 状态公开可查，不能把链上 storage 当私有数据库。
- 调用有成本和顺序，受 gas、区块顺序和外部状态影响。
- 权限必须显式，mint、pause、upgrade、withdraw 等敏感动作不能依赖默认信任。

知识点：

- **Solidity** 是 EVM 生态常见合约语言。学习重点不是语法，而是 storage、`msg.sender`、modifier、event、external call、revert、权限控制。
- **EVM** 是合约执行环境，解释了 gas、storage 成本、外部调用风险和多链兼容。
- **ABI** 是应用和合约沟通的接口说明，告诉工具能调用什么，但不保证调用安全。
- **Event** 是合约向外部系统留下的可索引日志，前端、索引器和分析工具常依赖它构建历史记录。
- **Upgrade** 是安全、治理和产品迭代之间的权衡。可升级合约更灵活，但引入管理员权限、治理攻击和信任问题。

一个链上调用不是“按钮点击”这么简单。完整链路通常包括：前端读取钱包和网络，按 ABI 编码调用数据，钱包确认签名，交易经 RPC 广播，验证者打包进区块，EVM 执行合约逻辑，event 被索引器读取，前端再更新状态。

AI x Web3 里的边界：模型可以解释 ABI、生成调用参数、解释交易结果、写测试用例；合约必须承担最终规则和约束。

## 5. 开发栈：把不可逆执行前移到可验证流程

Web3 开发栈不是收集工具名，而是让合约开发、测试、部署、前端调用和监控变成可重复系统。一个最小链路包括：

1. 写合约。
2. 编译合约，得到 bytecode 和 ABI。
3. 在本地链或测试网部署。
4. 写测试覆盖状态变化和权限边界。
5. 前端用地址和 ABI 读合约或发交易。
6. 在区块浏览器验证源码、交易和事件。

工具分层：

- **Remix**：适合入门、教学、原型和观察合约调用流程，但不适合长期替代工程化 repo。
- **Hardhat**：适合 JavaScript/TypeScript 项目，把合约开发接到测试、部署脚本、前端和 CI。
- **Foundry**：偏命令行和 Solidity-native 测试，适合高强度合约开发、fuzz testing、fork testing 和快速反馈。
- **OpenZeppelin**：提供 ERC 标准、Ownable、AccessControl、Pausable 等成熟组件，但不能替代业务逻辑审查。
- **viem / wagmi**：解决前端与链交互，重点是钱包连接、网络、合约读写、交易状态和缓存。

我需要记住：链上开发不是普通代码生成。AI 可以提升效率，比如解释 ABI、生成部署脚本、补测试、排查交易失败，但 Agent 如果能运行 `forge test`、读取部署配置、调用 `cast` 或生成前端合约调用代码，就必须被 repo workflow、测试、权限和 secret 管理约束。

## 6. 网络：链上状态的执行环境

Network 不是背景，而是交易能否被打包、状态能否同步、费用如何产生、确认要多久、L2 和主网如何分工的基础环境。

关键点：

- **Block** 是交易被批量提交和排序的单位。交易顺序会影响结果，区块 gas limit 限制吞吐，新区块引用前一区块形成历史。
- **Consensus** 让节点在没有中心数据库的情况下，对区块顺序和状态变化达成一致。应用要考虑 confirmation、短暂重组和 RPC 延迟。
- **PoS** 用质押和惩罚机制组织验证者，安全来自经济质押、客户端实现和节点参与。
- **Testnet** 适合验证部署脚本、钱包连接、RPC 配置、合约调用和前端状态处理，但不能替代主网安全审查。
- **L2 / Rollup** 在安全、成本、速度和复杂度之间做权衡。费用更低不代表复杂度消失，桥、提现等待、排序器、跨链状态同步都会影响产品体验。

AI Agent 读取或执行链上动作时，必须明确网络上下文：chain id、RPC 来源、区块高度、合约地址、交易哈希、确认数、explorer 链接。主网和测试网、L1 和 L2、不同 chain id 的状态不能由模型猜。

## 7. 账户抽象：把权限变成可编程规则

账户抽象试图把账户从“谁有私钥谁控制”扩展成“在什么条件下允许什么动作”。这对 AI x Web3 特别重要，因为 Agent 不应该拿用户主私钥，也不应该拥有无限交易权限。

核心概念：

- **ERC-4337**：通过 `UserOperation`、Bundler、EntryPoint、Paymaster 等组件实现智能账户交易流程。
- **Smart Account**：由合约控制的账户，可以支持多签、恢复、批量执行、额度限制、方法限制和策略模块。
- **Bundler**：收集 `UserOperation`，模拟验证并提交到 EntryPoint。它是应用的基础设施依赖。
- **Paymaster**：允许第三方赞助 gas 或让用户用非原生资产支付费用，但需要风控和额度限制。
- **Session Key**：给应用或 Agent 的临时权限，可以限制时间、链、合约、方法、额度和次数。

账户抽象不是让 AI 更自由，而是把 AI 的自由包在规则里。一个合理的 Agent Session Key 策略应该写清楚允许调用的合约和方法、额度、过期时间、chain id、最大交易次数、必须回到用户钱包确认的动作、撤销方式和审计日志。

## 8. DeFi：可组合金融，也会放大风险

DeFi 把资产、交易、借贷、稳定币和流动性协议化。它的难点不是合约能不能运行，而是资产和机制如何相互影响。

关键概念：

- **Token** 是资产单位。看 token 不能只看名称和图标，还要检查合约地址、decimals、供应量、发行权限、暂停/冻结/增发/升级、特殊转账税或黑名单逻辑。
- **AMM** 用流动性池和公式替代订单簿。需要理解滑点、流动性提供者、价格影响、MEV 和 sandwich risk。
- **Lending** 把抵押、债务、利率、清算写进合约。风险来自抵押品价格、预言机、流动性、参数和依赖资产。
- **Stablecoin** 是计价和结算基础，但稳定来自不同机制，不是天然保证。要看储备、赎回、抵押品、监管、治理和流动性。
- **Liquidity** 决定资产能否以合理成本买入、卖出、借出、清算或退出。没有流动性支撑的价格只是屏幕数字。

AI 进入 DeFi，适合先做信息整理和风险辅助：解释交易、总结仓位、监控清算、识别异常价格、生成策略草案。高风险动作包括 swap、借贷、加杠杆、授权、跨链和清算。如果 Agent 要执行，至少需要额度限制、协议白名单、滑点上限、模拟结果、预言机检查、人工确认和交易后审计记录。

## 9. 预言机：链外数据进入链上的信任边界

区块链不能天然知道链外世界发生了什么。Oracle 的作用是把价格、天气、比赛结果、储备证明、随机数或计算结果，以合约可用的形式带进链上。

关键理解：

- 预言机不是“真实世界 API”，而是链上合约愿意信任的一套数据提交和验证机制。
- 一旦外部数据进入链上，它就会变成协议规则的一部分。
- 数据源、更新频率、聚合方式、权限和异常处理都会影响用户资产安全。

知识点：

- **Price Feed** 是常见形式。读取价格时要检查资产对、decimals、更新时间、异常值和当前链上的 feed 地址。
- **Data Feed** 可以包括储备证明、利率、宏观数据、体育结果、灾害事件等。
- **Oracle Risk** 包括数据源操纵、feed 延迟、节点离线、单位错误、低流动性资产价格攻击、stale price、升级权限不透明。
- **AI Oracle** 把模型推理、评分、分类或生成结果提交给链上系统，会涉及模型版本、输入数据、prompt、评估标准、复核和争议处理。

我对 AI Oracle 的判断：不能让“模型说什么，合约就执行什么”。更合理的方式是记录输入、来源、模型版本、置信度和输出，给高风险结果设置 human-in-the-loop、挑战期、多人验证或经济惩罚。

## 10. 索引：从链上事实到产品可用数据

链上数据公开，不等于好用。Indexing 的作用是把区块、交易、事件和状态整理成产品、分析工具和 AI Agent 能快速查询的结构化数据。

关键理解：

- 链上是事实来源，索引层是可用数据层。
- RPC 适合读取链状态和发送交易，不适合承载所有复杂历史查询。
- 产品需要面向问题的数据模型，例如地址仓位、协议 TVL、订单状态、Agent 执行历史，而不是原始区块流。
- 索引要能重放，以处理 reorg、bug 修复、合约升级和数据补偿。

知识点：

- **Event Indexing**：监听合约日志，把 `Transfer`、`Deposit`、`VoteCast` 等事件转成查询记录。
- **Subgraph**：声明要监听的合约和事件、事件到实体的 mapping，并通过 GraphQL 暴露查询。
- **RPC**：可用 `eth_call`、`eth_getLogs`、`eth_sendRawTransaction` 等接口，但会遇到 rate limit、节点不同步、archive 数据不可用、多 RPC 不一致等问题。
- **Data Pipeline**：把 RPC、event listener、ABI 解码、数据库、reorg 处理、API、GraphQL、vector store、dashboard 和 Agent context 组合起来。

AI Agent 需要上下文，而链上上下文通常来自索引层。好的索引层应该给 Agent 提供结构化、带来源、带时间戳、可回溯的数据。模型负责解释，索引层负责事实。

## 11. 安全：从设计到执行后的完整流程

Web3 安全不是上线前找人审一次代码，而是从合约设计、权限、测试、交易模拟、监控、应急暂停到权限撤销的一整套工程流程。

核心原则：

- 链上系统默认暴露在公开对抗环境里，任何可调用路径都要按攻击面看待。
- 权限必须最小化，owner、admin、upgrade、pause、withdraw 都要有清楚边界。
- 执行前要模拟，尽量提前看到资产变化、合约调用、revert 和异常授权。
- 上线后要监控，大额转账、权限变更、合约升级、预言机异常、失败交易、TVL 流出和 Agent 高风险调用都需要观察。

知识点：

- **Reentrancy**：外部调用未完成前被再次调用，防护思路包括 Checks-Effects-Interactions、reentrancy guard、避免状态未更新前调用不可信合约。
- **Access Control**：不要只问有没有 `onlyOwner`，还要问 owner 是谁、是否多签、是否 timelock、角色能否互授、权限变更是否有 event、私钥泄漏最坏结果是什么。
- **Audit**：审计不是安全保证书。要看覆盖 commit、合约范围、已修复问题、接受风险、依赖版本、部署参数和上线代码是否一致。
- **Simulation**：交易发出前的预演，可检查资产变化、revert、gas、授权、链 ID、滑点、余额和方法是否符合预期。
- **Monitoring**：监控只有和响应流程结合才有效。谁收到告警，谁能 pause，谁确认误报，谁恢复系统，都要提前设计。

AI 会让安全边界更复杂。Agent 可以解释合约、生成交易、调用工具和执行策略，但也可能读错上下文、被 prompt injection 影响、调用错误工具或生成危险交易。因此 AI x Web3 的安全设计必须拆开：模型输出建议，工具返回事实，policy 限制权限，simulation 预演结果，human check 确认高风险动作，monitoring 记录执行后果。

## 12. AI x Web3 Research Agent 的产品化启发

结合前三天 AI 基础笔记，我可以把 Web3 基础接到一个更具体的 Hackathon / 产品研究方向：**只读优先的 AI x Web3 Risk Research Agent**。

MVP 能力：

1. 输入合约地址、交易哈希、协议名称或 DAO 提案链接。
2. Agent 通过索引层、RPC、区块浏览器和文档 RAG 收集证据。
3. 输出结构化风险报告：网络、合约、钱包动作、权限、DeFi 暴露、预言机依赖、索引数据来源、安全检查。
4. 对所有高风险动作只生成 checklist，不直接执行。
5. 如果要进入执行阶段，需要智能账户/session key 策略、simulation 和 human confirmation。

需要的 Web3 数据字段：

- chain id、network、block number、timestamp。
- contract address、ABI、verified source、upgrade status。
- wallet action type：connect / sign message / send transaction。
- transaction hash、status、method、from/to、value、token transfers、logs、gas used。
- event sources、indexer timestamp、reorg handling。
- oracle feed address、decimals、latest update、stale check。
- DeFi token decimals、liquidity、slippage、health factor、liquidation threshold。
- security signals：admin、multisig、timelock、pause、upgrade、audit commit、monitoring events。

这类产品的价值不是替用户“自动上链”，而是让用户在签名前知道自己将要做什么、依据是什么、风险在哪里、哪些事实来自工具、哪些只是模型推断。

## 13. 我的 Web3 操作检查清单

- [ ] 当前链和 chain id 是否正确？
- [ ] 合约地址是否来自可信来源？
- [ ] ABI 是否匹配已验证源码？
- [ ] 这是读取、签名消息，还是发送交易？
- [ ] 是否涉及 token approve、资产转移、升级、pause、admin、oracle、清算？
- [ ] token decimals、单位、滑点、gas、余额、allowance 是否确认？
- [ ] 交易是否已经 simulation？
- [ ] 是否有 explorer 链接或交易哈希可验证？
- [ ] 索引数据是否标注来源、区块高度、更新时间？
- [ ] 预言机数据是否 stale，feed 地址是否正确？
- [ ] 高风险动作是否需要人工确认？
- [ ] 私钥、助记词、API key、cookie 是否完全不进入 AI 上下文和仓库？

## 14. Handbook Feedback Candidate

建议 Web3 基础部分可以增加一个贯穿案例，例如：

> 用户让 AI Agent 帮忙分析并准备一次测试网 DeFi swap。

这个案例可以串起：

- Cryptography：签名不是普通确认。
- Wallet：连接、签名和交易是不同风险动作。
- Smart Contract：swap 调用由合约规则执行，ABI 只是接口。
- Dev Stack：前端、ABI、合约地址、测试和区块浏览器验证要连起来。
- Network：测试网、L2、chain id、RPC 和确认数影响结果。
- Account Abstraction：Agent 只能拿受限 session key。
- DeFi：滑点、流动性、token decimals、MEV 是关键风险。
- Oracle：价格来源和 stale price 影响判断。
- Indexing：交易历史和事件来自可回溯索引。
- Security：执行前 simulation，执行后 monitoring，高风险动作 human check。

这样学习者能把 Web3 基础从术语表连接成一条真实产品流程。

## 15. 今日行动项

- [x] 阅读 Web3 基础全部 10 节。
- [x] 整理各节之间的系统关系。
- [x] 形成 AI x Web3 Risk Research Agent 的产品化启发。
- [x] 写出 Web3 操作检查清单。
- [ ] 选择一个具体测试网交易哈希，做一次交易拆解练习。
- [ ] 选择一个协议合约，检查 ABI、event、admin、upgrade 和 oracle 依赖。
- [ ] 把 Handbook feedback candidate 整理成可提交反馈。
