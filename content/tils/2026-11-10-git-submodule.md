---
title: "Updating Git Submodules Recursively"
date: 2026-11-10T11:00:00+05:30
draft: false
tags: ["git", "cli"]
math: false
---

To pull and update all nested submodules in one command:

```bash
git submodule update --init --recursive --remote
