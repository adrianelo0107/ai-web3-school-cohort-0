# Governance AI / AI Sovereignty / Decentralized AI 学习笔记

日期：2026-05-27

阅读章节：

- https://aiweb3.school/zh/handbook/bridge/governance-ai/
- https://aiweb3.school/zh/handbook/bridge/ai-sovereignty/
- https://aiweb3.school/zh/handbook/bridge/decentralized-ai/

## 1. 总体理解

今天阅读的是 AI x Web3 Bridge 剩余三节：治理 AI、AI 主权、去中心化 AI。这三节和前几天的内容相比，重心从“Agent 如何安全执行”转向“Agent 和 AI 系统如何进入更大的社会、市场和用户控制结构”。

我的理解是：

- **Governance AI** 关注公共决策中的信息质量和来源可追溯。
- **AI Sovereignty** 关注用户对数据、模型、记忆、权限和退出权的控制。
- **Decentralized AI** 关注模型、数据、算力、推理和结算如何形成可选择、可替代、可评估的开放市场。

如果说前几天学的是“如何让 Agent 不乱动用户资产”，今天学的是“如何避免 AI 系统变成新的中心化权力”。治理 AI 防止公共决策被信息不对称和叙事操控左右；AI 主权防止用户被平台、模型和记忆锁定；去中心化 AI 防止模型、数据、算力和推理服务被少数入口垄断。

我今天最大的收获是：AI x Web3 的目标不只是让 AI 更能做事，也要让 AI 系统本身更可质疑、可迁移、可替换、可退出。Web3 在这里提供的不是“把 AI 上链”的外壳，而是围绕控制权、可验证记录、开放市场和公共协作的一组制度工具。

## 2. Governance AI：降低治理信息不对称，而不是替社区投票

### 2.1 内容转述

Governance AI 不是让 AI 替社区做治理决策，而是帮助治理参与者更好地阅读提案、理解预算、追踪会议、整理贡献关系，并保留来源和不同观点。

治理场景的难点是信息量大、上下文分散、参与门槛高。DAO、协议和公共物品社区通常会有论坛提案、会议纪要、预算申请、链上投票、历史拨款和贡献记录。少数深度参与者掌握大量上下文，多数普通成员只能读到压缩后的结论，这会造成信息不对称。

这一节提到的知识节点包括：

- **Proposal Summary**：把提案整理成目标、背景、预算、执行计划、风险、支持理由、反对理由和未决问题。
- **Meeting Action**：从会议讨论中提取负责人、截止时间、上下文链接和决策状态。
- **Contribution Graph**：整理贡献关系，帮助社区看到隐形贡献，而不只是统计 commit 或发言数量。
- **Budget Check**：检查预算申请是否完整、金额是否和工作范围匹配、付款地址是否清楚、历史拨款是否完成。
- **Source Traceability**：每条关键摘要都应能回到提案、论坛、会议、链上交易或投票记录。
- **Deep Funding**：AI 可以整理公共物品影响和贡献证据，但资金分配仍需要多元评审和公开规则。
- **Plurality**：治理 AI 应呈现不同群体的理由、偏好和担忧，而不是把分歧压成一个平均意见。

### 2.2 我的理解

我以前容易把治理 AI 理解成“提案摘要器”，但读完后觉得它更像公共决策的信息基础设施。治理里的 AI 不应该追求给出一个漂亮结论，而应该让社区更容易看到完整上下文。

治理和普通问答不同。普通问答可能追求准确、简洁、直接；治理场景还要保留争议。一个预算提案是否合理，往往不是单一事实，而是价值判断、历史贡献、机会成本、执行风险和利益相关方视角共同作用的结果。

所以我会把 Governance AI 的第一原则写成：

> AI 可以压缩信息，但不能压缩分歧。

一个好的治理摘要应当做到：

- 把事实、观点、推断和建议分开。
- 每条关键结论都有来源。
- 保留支持意见和反对意见。
- 明确哪些问题没有回答。
- 标出预算、地址、里程碑和历史执行情况。
- 不替用户投票，不把模型判断包装成治理共识。

这对我自己的 AI x Web3 Risk Research Agent 也有启发。除了交易和合约风险，我还可以加入治理风险分析：提案预算是否清晰、付款地址是否可信、历史拨款是否履约、反对意见是否被摘要保留、链上执行和论坛承诺是否一致。

### 2.3 产品化思考

如果把 Governance AI 做成产品，我会优先做这些低风险但有价值的功能：

1. **Source-preserving Proposal Summary**
   - 输出提案目标、预算、执行计划、支持/反对理由。
   - 每个关键点附来源链接。

2. **Budget Checklist**
   - 检查金额、付款地址、里程碑、历史拨款、交付物。
   - 标记“事实”和“判断”。

3. **Meeting-to-Action**
   - 从会议纪要提取 action owner、deadline、decision status。

4. **Contribution Evidence Pack**
   - 整理 GitHub、论坛、会议、链上支付、文档维护等贡献证据。

我不会一开始做“自动投票建议”。治理 AI 的价值应该是帮助人做更好的公共判断，而不是代替人行使公共权力。

## 3. AI Sovereignty：用户要能控制、迁移、替换和退出

### 3.1 内容转述

AI Sovereignty 讨论的是用户在 AI 系统中的控制权。随着 Agent 变得更了解用户，AI 系统会积累用户偏好、工作流、对话历史、钱包上下文、任务记录和长期记忆。如果这些数据只能被平台控制，用户会被新的 AI 平台锁定。

知识节点包括：

- **User Control**：用户能控制自己的数据、记忆、权限和 Agent 行为范围。
- **Data Portability**：用户能把上下文、记忆、任务记录和数据迁移到其他系统。
- **Model Choice**：用户能选择不同模型、供应商或本地模型。
- **Local-first AI**：敏感任务尽可能在本地或用户控制环境中处理。
- **Censorship Resistance**：减少单点平台对模型、上下文、工具访问和表达空间的控制。
- **d/acc**：强调防御性、去中心化、民主化和差异化的技术发展方向。
- **CROPS**：强调控制权、可恢复性、开放性、可携带性和主权等原则。

### 3.2 我的理解

AI 主权让我重新思考“个人 AI 助手”的长期风险。一个好用的 Agent 会越来越了解我：学习目标、研究方向、写作偏好、常用工具、项目计划、钱包行为、预算习惯。如果这些上下文只能存在于某个平台里，那么用户会因为“离开后助手不懂我”而被锁定。

这种锁定比普通 App 更强。普通 App 锁定的是数据和网络效应；AI Agent 锁定的是长期上下文和工作习惯。用户越使用，迁移成本越高。

所以 AI Sovereignty 不只是“数据属于用户”这句口号，而是要落成几个具体能力：

- 用户能看到 Agent 记住了什么。
- 用户能删除不想保存的记忆。
- 用户能导出笔记、报告、任务记录和偏好。
- 用户能更换模型或服务商。
- 用户能撤销工具、钱包、API 的权限。
- 敏感任务能在本地或用户控制环境中处理。

我也意识到，我目前的学习仓库本身就是一种 AI 主权实践。把学习笔记、daily 草稿、项目方向和反馈候选沉淀在自己的 GitHub，而不是只留在对话记录里，可以减少平台锁定，也方便以后换模型、换 Agent 或迁移工作流。

### 3.3 产品化思考

对我的 Learning Agent 或 Risk Research Agent，我会把 AI Sovereignty 转成这些设计要求：

- **Memory review**：用户能查看 Agent 保存的长期偏好。
- **Memory expiration**：任务级上下文默认过期。
- **Data export**：报告、trace、eval set、笔记都能导出到用户仓库。
- **Model switch**：核心流程尽量不绑定单一模型。
- **Permission revocation**：钱包权限、API token、工具授权都能撤销。
- **Local/private mode**：钱包地址、预算、未公开项目、敏感交易分析可选择本地处理或不进入长期记忆。

我认为 AI 主权会成为长期 AI 产品的信任基础。用户不会愿意把全部工作上下文交给一个无法退出的平台。

## 4. Decentralized AI：开放市场，而不是“所有东西都上链”

### 4.1 内容转述

Decentralized AI 讨论的是 AI 能力如何减少对单一平台的依赖，在模型、数据、算力、推理、路由、评估和结算层形成开放市场。

知识节点包括：

- **Model Market**：不同模型可以被发现、比较、调用和付费。
- **Data Market**：数据提供者可以授权或出售数据，使用者能了解来源和使用条件。
- **Compute Market**：算力成为可调度和可结算的资源。
- **Inference Network**：推理服务可以由多个节点或服务商提供。
- **Model Routing**：根据任务类型、成本、延迟、隐私和质量选择模型。
- **Quality Benchmark**：开放市场需要质量评估，否则用户无法判断服务。
- **Settlement**：模型调用、数据使用、推理服务和计算任务需要可结算、可追踪。

### 4.2 我的理解

我不想把去中心化 AI 理解成一个口号，也不认为它等于“所有模型都要上链”。更准确的理解是：

> 去中心化 AI 是让模型、数据、算力和推理服务可以被选择、比较、替换和结算。

这和 AI 主权是互补的。用户要有选择权，市场里必须真的有替代服务。如果只有一个模型、一个数据源、一个推理入口，那么用户即使拥有数据，也很难拥有实际主权。

但开放市场也会带来新的问题：

- 模型质量如何比较？
- 数据来源是否可靠？
- 推理服务是否真的执行了请求？
- 计算结果是否可验证？
- 服务失败如何退款？
- 节点或模型长期表现如何积累声誉？

所以 Decentralized AI 必须和前几天读过的 Verifiable AI、AI Oracle、Machine Payment、Agent Trust & Reputation 连接起来。没有 benchmark，模型市场只是营销市场；没有 verifiable compute，推理网络很难被信任；没有 settlement，服务调用无法形成真实商业闭环；没有 reputation，用户无法判断服务商长期可靠性。

### 4.3 产品化思考

对 Risk Research Agent 来说，去中心化 AI 的第一步可以不是接入复杂的 decentralized compute network，而是先做 **Model Routing + Evaluation Log**：

- 普通摘要用低成本模型。
- 合约风险分析用强推理模型。
- 敏感钱包分析用本地模型或隐私模式。
- 报告质量评估用独立 judge 模型。
- 每次模型调用记录 model id、version、cost、latency、输入类型和输出质量。

这已经开始实践“模型可替换、可比较、可审计”。未来如果接入开放模型市场或推理网络，就可以用这些日志和 eval 结果作为选择依据。

## 5. 三节之间的关系

我可以把今天三节理解成 AI x Web3 的公共层：

- Governance AI 关注公共决策：AI 如何帮助群体更好地看见事实和分歧。
- AI Sovereignty 关注个人控制：用户如何保留数据、模型、记忆和退出权。
- Decentralized AI 关注市场结构：AI 能力如何不被单点平台垄断。

这三节共同回答一个问题：

> 如果 AI Agent 将来真的进入工作、支付、治理和协作网络，我们如何避免它变成新的黑箱平台权力？

答案不是单一技术，而是多层设计：

- 治理要 source traceability 和 plurality。
- 用户要 data portability 和 model choice。
- 市场要 benchmark、routing、settlement 和 reputation。
- 产品要默认保留人工决策、退出权和可审计记录。

## 6. 我的项目方向收敛

读完整个 Bridge 后，我的项目方向更加清晰：

> Verifiable AI x Web3 Risk Research Agent

它不是自动交易机器人，而是一个面向用户、开发者和治理参与者的链上风险研究和解释系统。

### 6.1 MVP 功能

- 输入：合约地址、交易哈希、DAO 提案链接、协议名称。
- 读取：链上状态、explorer、ABI、event、文档、治理论坛。
- 输出：结构化风险报告。
- 标注：事实 / 文档 / 模型推断 / 不确定信息。
- 记录：input hash、tool trace、model version、report hash。
- 防护：prompt injection 检测、secret redaction、未知合约写入拒绝。
- 主权：报告和 trace 可导出到用户仓库，任务记忆可删除。

### 6.2 为什么这个方向适合我

- 和我的学习目标匹配：Hackathon / 产品研究。
- 不需要一开始做高风险自动交易。
- 能用到 AI 基础：RAG、Agent、MCP、Evaluation、Inference。
- 能用到 Web3 基础：钱包、合约、索引、预言机、安全。
- 能用到 Bridge：chain-aware context、tool use、workflow、identity、verifiable AI、privacy、sovereignty、governance。

### 6.3 我目前的设计原则

- 先只读，再草稿，再模拟，最后才考虑执行。
- 所有结论必须有来源或标注为推断。
- 不保存私钥、助记词、cookie、session token。
- 不自动执行无限 approve、未知合约写入、跨链桥、大额转账。
- 用 eval set 覆盖错误链、恶意文档、未知合约、oracle stale、simulation failure。
- 把输出做成可审计报告，而不是一次性聊天回答。
- 支持导出和迁移，避免把用户上下文锁死在单一平台。

## 7. Handbook 总体复盘

读完 Handbook 的主线后，我对 AI x Web3 的理解从“AI + 区块链工具”变成了“让概率模型进入可验证经济和协作系统的一整套边界设计”。

AI 侧提供理解、生成、检索、计划和工具编排；Web3 侧提供账户、权限、支付、结算、身份、声誉、链上事实和可验证执行。真正的难点在 Bridge：上下文要链感知，工具要受限，钱包要可撤销，支付要有预算，结算要能争议，身份要可追踪，声誉要分域，AI 输出要可验证，系统要安全，数据要隐私，用户要保有主权，治理要保留分歧。

我现在不会再把 AI x Web3 简化成“AI 帮我发交易”。更准确的表达是：

> AI 帮用户理解、准备、检查和协作；Web3 负责权限、结算、证明和追责；产品负责把二者之间的边界设计清楚。

这也是我后续做项目时要坚持的标准。

## 8. 实践检查清单

- [ ] AI 输出是否区分事实、来源、推断和不确定信息？
- [ ] 治理摘要是否保留反对意见、少数派观点和来源链接？
- [ ] 预算检查是否包含金额、地址、里程碑、历史拨款和交付状态？
- [ ] Agent 记忆是否可查看、可删除、可导出？
- [ ] 用户能否更换模型或导出上下文？
- [ ] 敏感任务是否支持 local/private mode？
- [ ] 模型调用是否记录 model id、version、cost、latency 和任务类型？
- [ ] 是否有 eval/benchmark 来比较不同模型或服务？
- [ ] 是否避免把用户锁定在单一平台、单一模型、单一工具入口？
- [ ] 项目是否能解释为什么需要 Web3，而不是为了上链而上链？

## 9. Handbook Feedback Candidate

建议 Handbook 可以增加一个主线收束案例：

> 构建一个 Verifiable AI x Web3 Risk Research Agent。

这个案例可以把已学内容串起来：

- AI Basics：Prompt、Context、RAG、Agent、MCP、Evaluation、Inference。
- Web3 Basics：Wallet、Smart Contract、Dev Stack、Network、Oracle、Indexing、Security。
- Bridge：Chain-aware Context、Tool Use、Workflow、Agent Wallet、Payment、Identity、Reputation、AI Oracle、Verifiable AI、Security、Privacy、Sovereignty、Governance。

最终产出可以是一个只读优先的产品原型：输入交易哈希/合约/提案，输出带来源、trace、风险分类和隐私保护的报告。这样学习者不会停留在概念笔记，而能把 Handbook 变成真实项目。

## 10. 今日行动项

- [x] 阅读 Governance AI。
- [x] 阅读 AI Sovereignty。
- [x] 阅读 Decentralized AI。
- [x] 完成 Bridge 主线阶段性复盘。
- [x] 收敛自己的项目方向：Verifiable AI x Web3 Risk Research Agent。
- [ ] 为 Risk Research Agent 写第一个 PRD 草稿。
- [ ] 设计最小 eval set：10 个合约/交易/提案风险分析样本。
- [ ] 做一个交易哈希解释器的最小原型。
