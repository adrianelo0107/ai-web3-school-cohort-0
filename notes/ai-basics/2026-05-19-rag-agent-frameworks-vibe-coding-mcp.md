# RAG / Agent / Frameworks / Vibe Coding / MCP 学习笔记

日期：2026-05-19

来源：

- https://aiweb3.school/zh/handbook/ai/rag/
- https://aiweb3.school/zh/handbook/ai/agent/
- https://aiweb3.school/zh/handbook/ai/frameworks/
- https://aiweb3.school/zh/handbook/ai/vibe-coding/
- https://aiweb3.school/zh/handbook/ai/mcp/

## 1. 总结

这五节可以串成一条从“知识”到“行动”的 AI 工程链路：

- **RAG** 负责把外部知识变成可追溯、可引用、可拒答的证据链。
- **Agent** 负责把用户目标拆成多步任务，并在工具、状态、权限和停止条件约束下推进。
- **Frameworks** 负责把模型、工具、检索、状态、评估、追踪和部署组织成可维护系统。
- **Vibe Coding** 负责把人和 AI Coding Agent 的开发反馈循环压短，但不替代工程判断。
- **MCP** 负责把模型与外部资源、工具、prompts 的连接协议化，让工具可描述、可发现、可管理。

对 AI x Web3 来说，这条链路的核心不是“让 AI 更自主”，而是让 AI 在证据、权限、审计和人类确认的边界内变得更有用。

## 2. RAG：证据链，而不是向量库本身

RAG 的目标不是让模型回答得更长，而是让回答有来源、有版本、有边界。LLM 的训练知识会过期，context window 也不可能塞下全部协议文档、治理论坛、审计报告和 SDK 变更记录，所以需要在回答前先取回相关材料。

我需要记住的关键点：

- **Chunking**：文档切分要尽量按结构，而不是只按固定字数。协议文档、API 参数、风险提示、版本变更经常跨段落出现，切得太碎会丢限制条件，切得太大又会引入噪声。
- **Vector DB**：向量相似不等于事实正确。向量库里应该保存 metadata，例如来源、版本、chain、更新时间、可信等级、是否废弃。
- **Retriever**：如果问题涉及版本、时间、链、地址、产品或环境，就不能只做纯向量搜索，要结合 metadata filter、关键词检索或混合检索。
- **Rerank**：当候选结果多、相似度接近或来源质量不同，rerank 可以把更相关、更权威、更完整的材料排到前面。
- **Citation**：引用不是装饰，而是用户验证答案的入口。关键判断需要能回到具体文档、段落、commit、治理帖子或链上记录。
- **Refusal**：检索失败时允许拒答。没有证据时硬答，只是把幻觉从模型转移到了检索系统。

在 Web3 场景里，RAG 可以用于协议文档问答、合约接口解释、治理提案摘要、审计报告检索、SDK/API Copilot、交易背景解释。但 RAG 结果只说明“资料怎么说”，不能直接推出“用户应该签名”。只要输出可能影响链上动作，就还需要 simulation、policy check 和 human confirmation。

## 3. Agent：被约束的执行循环

Agent 不是“模型有了自主权”，而是模型围绕目标持续调用工具、读取状态、调整步骤的执行循环。它的价值是把建议推进到行动，风险也在这里：一旦 Agent 能写系统、提交请求、调用 API 或触发支付，错误就从“答错”变成“做错”。

可用 Agent 的基本组成：

- **目标**：用户到底要完成什么，不只是闲聊意图。
- **工具**：能搜索、读文件、查数据库、调用 API、跑代码或生成交易草稿。
- **状态**：任务进度、工具返回、错误、预算、确认记录和最终输出必须外置、可查、可恢复。
- **权限**：区分只读、写入、外部副作用、高风险动作。
- **停止条件**：达到目标、预算超限、信息不足、风险越界、用户拒绝，都应该停下来。

我对几个知识节点的理解：

- **Tool Use**：工具让 Agent 从“会回答”变成“能做事”，但工具权限越高，Prompt Injection 和误判后果越严重。每个工具都要有输入 schema、权限范围、副作用说明、日志和人工确认规则。
- **Planning**：计划只是候选路线，不是授权。越接近写入、支付、签名、投票、部署，越需要系统规则拆开检查。
- **State**：不能只把状态塞进聊天历史。生产系统需要回答：Agent 为什么调用这个工具、是否拿到确认、哪一步失败、能否恢复。
- **Reflection**：自我检查可以提升质量，但不能承载安全。模型给自己的错误找理由并不罕见，外部验证更重要。
- **Multi-Agent**：多个 Agent 适合复杂分工，但也会放大上下文传递、责任边界和权限扩散问题。

AI x Web3 Agent 的稳妥路径应该是：用户提出目标和约束，Agent 生成计划；系统把步骤拆成只读和候选写入；只读工具可自动执行，写入工具进入 policy/simulation；高风险动作由用户确认；钱包或 smart account 执行；全流程记录日志。

## 4. Frameworks：系统边界，不是智能本身

框架的作用不是“让模型更聪明”，而是把模型、工具、状态、检索、评估和部署组织成可维护系统。直接调用模型 API 可以完成简单任务；进入产品后，就会遇到 prompt 版本管理、工具 schema、Agent state、失败重试、用户反馈、线上 tracing 和 eval 等工程问题。

我的判断标准：

- 简单链路保持简单：一次模型调用、一次检索、一次格式化输出，不一定需要复杂框架。
- 长流程需要显式状态：多步工具调用、人工确认、失败恢复，应该有可查询 state。
- 框架要能退出：如果很难换模型、换向量库、换部署方式，长期成本会高。
- 先画清楚输入、状态、工具、输出、评估和失败路径，再决定要不要框架。

几个框架/方向的理解：

- **LangChain**：更像组件库，覆盖模型接入、prompt、retriever、agent、output parser 等。适合快速组合能力，但不应该替代产品边界设计。
- **LangGraph**：偏 workflow 和 state machine。只要任务关心“走到哪一步、失败后从哪里继续、是否需要人工确认”，graph/state machine 就有价值。
- **OpenAI Agents SDK**：组织带工具、handoff、guardrails、tracing 的 Agent 应用。关键仍是定义哪些工具可用、哪些动作需要确认、什么输出算失败。
- **DSPy**：把 prompt / LM pipeline 当成可优化程序。适合有数据集、指标和可重复任务的场景，不适合只靠感觉调 prompt。
- **Learning Agent**：从失败样本、日志、用户反馈、评估结果中改进系统。稳妥流程是记录失败样本，标注原因，加入 eval/regression set，再修改 prompt、retriever、工具或模型配置，通过测试后上线。

在 AI x Web3 中，Frameworks 管理 prompt、tools、state、eval 和 trace；Web3 基础设施管理账户、签名、合约、交易和链上状态；产品层定义用户目标、权限边界、确认流程和失败处理。

## 5. Vibe Coding：压短反馈循环，但不放弃工程判断

Vibe Coding 不是把需求丢给 AI 等代码出现，而是人和 AI Coding Agent 共同迭代软件。人负责方向、边界和验收；Agent 负责搜索、生成、修改、执行一部分工程动作。

核心原则：

- **任务要小**：越具体、边界越清楚，Agent 越容易产出可审查结果。
- **上下文要准**：让 Agent 看到正确文件、设计约束、错误输出，比写长篇需求更重要。
- **验证要硬**：测试、类型检查、构建、截图、日志，比“看起来对”可靠。
- **版本控制是边界**：每次改动后至少看 `git diff`、文件列表、测试结果，以及是否包含密钥、日志、构建产物。

适用场景包括搭原型、修小 bug、补测试、写脚本、局部重构、解释陌生代码。不适合无边界重写整个项目。

对我当前目标的意义：Hackathon 阶段可以用 Vibe Coding 快速做原型、脚本和研究工具，但合约、签名、权限、支付、迁移脚本不能由 Agent 生成后直接上线。AI 可以写测试、解释 ABI、生成脚本草稿；上线前必须审查、模拟、多方确认。

## 6. MCP：工具接口标准，不是安全边界本身

MCP 试图把模型和外部工具、数据源、应用上下文之间的连接标准化。它解决的是“模型如何以可描述、可复用、可管理的方式使用外部能力”，而不是让模型本身更聪明。

我的理解：

- **Server**：提供 resources、tools、prompts 的一侧。重点是暴露什么资源、哪些工具只读、哪些有副作用、schema 是否清楚、错误如何返回、是否需要授权、日志在哪里。
- **Client**：连接模型和 server 的一侧，例如 IDE、Agent runtime、聊天客户端。它应该让用户知道当前连了哪些 server、模型能调用什么、调用前是否需要确认。
- **Tool Schema**：工具名字、用途、参数、返回值、约束都要清楚。schema 模糊，模型就会自然语言猜参数。
- **Permission**：MCP 让连接更方便，但方便不等于安全。读文档、查 issue、创建 PR、发支付、删文件是不同风险等级。

在 AI x Web3 中，MCP 可以作为 Agent 连接链上工具和开发工具的接口层，例如读取区块浏览器、查询合约文档、调用 RPC、生成交易草稿、读取项目 issue。但 MCP 不是钱包安全方案，不能替代账户权限、交易模拟、签名确认、session key 和审计日志。

## 7. 我可以落地的 Hackathon / 产品研究方向

可以把这五节组合成一个小型产品原型：**AI x Web3 Research Agent**。

MVP 设计：

1. **RAG 知识库**：抓取一个协议的官方文档、SDK 文档、治理帖子、审计报告；chunk 按标题/API/风险提示切分；metadata 保存来源、版本、chain、更新时间、可信等级。
2. **只读 Agent**：用户输入“帮我分析这个 DAO 提案/合约接口/项目风险”，Agent 只能读取资料、总结争议、列风险、标记证据不足。
3. **Framework 最小化**：先用直接 API 调用 + 明确 JSON 输出；当出现多步状态、失败重试、trace、人工确认时，再引入 LangGraph 或 Agents SDK。
4. **Vibe Coding 工作流**：每个功能从 issue 开始，Agent 做最小 patch，跑测试，生成 PR summary；人看 diff 和验证记录。
5. **MCP 只读工具层**：先暴露 `search_docs(query)`、`get_doc(path)`、`get_proposal(id)`、`get_contract_metadata(address)` 等只读工具；写入、签名、投票、部署留到权限升级阶段。

安全边界：

- RAG 输出必须带 sources 和 uncertainties。
- Agent 输出的是研究结论和操作草稿，不直接执行链上动作。
- Framework 记录 trace 和 state，便于复盘。
- Vibe Coding 产出必须进入 git diff/test/review。
- MCP 工具默认只读，写入工具必须单独授权、确认、审计。

## 8. 我的 Prompt 模板

```text
你是一个 AI x Web3 产品研究 Agent。

目标：
请基于给定资料，分析一个协议 / DAO 提案 / 合约接口 / Hackathon 项目，并输出可验证的研究结论。

上下文：
- 用户目标：
- 项目名称：
- 链 / 网络：
- 已知资料：
- 当前限制：

约束：
- 不要编造链上事实、余额、交易结果或合约状态。
- 区分“来源证据”“模型推断”“证据不足”。
- 涉及签名、授权、投票、转账、部署时，只能生成检查清单或草稿，不能直接建议执行。
- 如果缺少来源、版本或链上状态，明确列出需要补充的数据。

输出格式：
1. 一句话结论
2. 使用的来源
3. 关键发现
4. 风险点
5. 不确定信息
6. 下一步验证
7. 是否需要人工确认
```

## 9. Handbook Feedback Candidate

建议 Handbook 可以把 RAG、Agent、Frameworks、Vibe Coding、MCP 这五节用一个贯穿案例串起来，例如：

> 构建一个只读 DAO 提案研究 Agent。

这个案例可以展示：

- RAG 如何从治理论坛、官方文档、历史投票和审计报告中提供证据。
- Agent 如何把“分析提案”拆成检索、摘要、风险识别、输出检查清单。
- Framework 如何管理 state、tool schema、trace、eval 和失败重试。
- Vibe Coding 如何让学习者用 AI Coding Agent 快速实现原型并通过 git diff/test 验证。
- MCP 如何把文档检索、proposal 查询、合约 metadata 查询暴露成只读工具。

这样新学习者能更直观看到：这五节不是分散概念，而是一条可落地的 AI x Web3 工程链路。

## 10. 今日行动项

- [x] 阅读 RAG / Agent / Frameworks / Vibe Coding / MCP 五节。
- [x] 整理五节之间的关系。
- [x] 形成一个 Hackathon / 产品研究方向。
- [ ] 选择一个具体协议，设计 RAG metadata schema。
- [ ] 做一个只读 Research Agent 的最小任务流。
- [ ] 把 Handbook feedback candidate 整理成可提交反馈。
