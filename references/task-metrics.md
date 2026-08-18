# 轻量任务指标

仅 M/L 任务创建一份 JSON 指标。字段未知时使用 `null`，不根据 diff 或猜测补写。

```json
{
  "task_id": "T-0000",
  "risk": "M",
  "agent_count": 1,
  "spawn_count": 0,
  "rework_count": 0,
  "elapsed_ms": null,
  "token_usage": { "input": null, "cached": null, "non_cached": null },
  "context_chars": { "static": null, "tool_output": null, "summary": null },
  "quality": "passed | passed-with-exception | failed",
  "independent_review": "not-required | passed | missing",
  "verification": ["command or evidence path"],
  "unknowns": ["why a field is unavailable"]
}
```

将文件放到宿主仓库的任务状态目录；收尾归档引用其路径即可，不把 JSON 内容复制到常驻规则。
