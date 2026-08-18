---
name: evidence-workflow
description: 为编码与运营任务选择 S、M、L 风险路径，以紧凑上下文和可复现证据完成工作。Use for multi-step features, cross-module bugs, reviews, tests, deployments, or when token usage, multi-agent coordination, context drift, hallucinations, or resumable task state need deliberate control. Do not use for a clear single-file low-risk edit or a pure question.
---

# 证据化工作流

将上下文视为有限资源。主线程只保留决策和验收；只有确能提高质量时才拆分角色。

## 先分级，再派发

- **S**：单一、低风险修改或回答。单一负责人，做一次直接验证。
- **M**：单模块或一组紧密相关的改动。一个实现负责人；只有权限、数据、视觉、发布或回归风险实质存在时，再加独立复核。
- **L**：跨模块、数据、权限、部署，或有两条可独立验收且写集不重叠的 lane。冻结任务契约后才派发独立工作。

不要仅因文件多而派发，也不要并行写入重叠路径。敏感、破坏性、生产与外部操作仍服从宿主仓库的授权规则。

## 建立紧凑契约

读取 `references/task-contract.md`，记录目标、非目标、风险、允许路径、验收、证据与续跑锚点。不要粘贴日志或源码；用路径与命令替代。

## 用证据执行

1. 只做定向搜索与小范围读取。
2. 给每个被派发角色仅传任务切片：角色、路径、验收、证据；不要复制完整父会话。
3. 仅并行独立读取、测试或写集不重叠的修改。
4. 每个角色返回 `references/result-summary.md` 的短摘要。
5. 没有来源支撑的结论标记为未知；用测试、构建、调用链或其他可复现来源验证完成。
6. 主线程只保留短决策摘要，原始日志留在其文件路径。

M/L 完成时读取 `references/quality-gates.md` 与 `references/task-metrics.md`。用 `scripts/workflow-metrics.js` 记录指标；精确 token 遥测缺失时填写 `null`，不得估造。用 `scripts/workflow-context.js` 从 JSON 生成受限任务包，避免手抄大段角色文档。

## 收尾与恢复

归档必须记录本地 `completion_commit`、验证命令和指标文件路径；推送、PR、合并与部署仍需独立授权。区分事实、推断与未知项。中断优先复用原角色；否则带续跑锚点和证据路径继续。绝不把状态文件当作运行时真相，必须与实际任务、Git 和验证输出对账。
