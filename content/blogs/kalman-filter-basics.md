---
title: "State Estimation with Kalman Filters"
date: 2026-11-10T10:00:00+05:30
draft: false
tags: ["math", "control-systems", "algorithms"]
math: true
---

A quick look at the discrete state-space update step.

The linear measurement update equation is given by:

$$x_k = A x_{k-1} + B u_k + w_k$$

Where the Kalman Gain $K_k$ scales the innovation:

$$K_k = P_k^- H^T (H P_k^- H^T + R)^{-1}$$

Inline math check: the error covariance shrinks when $R \to 0$.
