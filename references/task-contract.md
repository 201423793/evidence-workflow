# 任务契约

控制在 600 token 内。使用路径和命令，不粘贴源码或日志。

```text
objective:
non_goals:
risk: S | M | L
read_set:
write_set:
acceptance:
evidence_required:
resume_anchor:
```

只有跨模块、数据、权限、部署，或确有可独立验证的非重叠写入 lane 时，才归为 L；大 diff 本身不足以升级风险。
