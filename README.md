# MCP対応 デバイス設定提案ツール
このリポジトリは、Model Context Protocol (MCP) に準拠した、文脈に応じてデバイス設定を提案するツールのデモ実装です。

## 背景と構成方針
- 理想構成：デバイス自体がMCP Hostとして動作し、最適な設定をLanguage Model＋外部ツールで決定
- 制約：現時点ではMCP Hostの条件を満たすことができないデバイスも存在する
- 本PoCの構成：
  - MCP HostをAzure Static Web Apps上のWebアプリ（Reactベース）として実装
  - MCP ClientではAzure OpenAI Serviceを利用
  - MCP ServerはAzure Functions上で稼働
