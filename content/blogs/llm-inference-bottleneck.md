---
title: "LLM Inference: Bottleneck"
date: 2026-11-27T10:00:00+05:30
draft: false
tags: ["LLM", "math", "hardware"]
math: true
---

### Intro 

> I learned most of these using this lfm3 fine tuned model: [`voltron-1-mini model`]() running locally in my machine !. (Didn't use any Cloud LLMs and Of Course I wrote everything myself).

Recently I watched a [video](), where [George Hotz]() said that in LLM Inference the main bottleneck is **Bandwidth (amount of memory it can process)** and *not the FLOPS*. I just explored why it's the case.

When we prompt a LLM, in general, there are two stages:

- **Pre-fill**: where model weights loads up and KV vectors are calculated in a **batch** (for whole of a input prompt). This is mostly FLOP constrained.

- **Decode**: where the next output token is predicted based on last KV vectors we obtained by processing all previous tokens. Once the context increases (for e.g., by subsequent chats), the KV cache also grows (variable cost) and also we have to *stream the model* as well for each token to be predicted (fixed cost). This is mostly Memory Bandwidth constrained.

If we look at how transformers work the above is obvious but by definition, we know that based on this ratio, Arithmetic Intensity, which's a part of [Roofline Model](), we calculate whether an operation is FLOP/Bandwidth constrained.

> Arithmetic Intensity is defined as no. of FLOPS per bytes transferred.

Since Pre-fill happens at the start of context and most of the subsequent parts are the Decode stage, KV cache (also model weights for lower contexts) remains the bottleneck and thereby it is Bandwidth constrained.

So based on this, 

> Can we estimate the token speed which we get from a local LLM ?

### Token Speed

In general, KV Cache memory usage follows [3],

$\text{KV cache} \approx 2 \times \text{sequence\_length} \times \text{no\_of\_layers} \times \text{head\_dim} \times \text{num\_kv\_heads} \times \text{quantization}$

For a model, it depends on their size (in turn depends on no_of_params and quantization).

$\text{tokens\_per\_second} = k \cdot \frac{\text{bandwidth\_MB\_per\_sec}}{\text{bytes\_per\_token\_MB}}$

`bandwidth_MB_per_sec` is obtained from GPU, bytes per token is from approximate KV Cache required for a token plus model weights.  k, to adjust for other stuff like effective bandwidth, embedding, etc. and k can be in the range of [].

Example? voltron?

### Models in a Harness

For a usual prompt-response it's fine, but what happens when used with a harness, how it handles the tool calls, thinking and other guard rails like do they "simply increase the context length" from a inference perspective? for e.g. what does `/compact` do?

Mostly Yes. They are a part of Decode stage. `/compact` generates a summary of context and replaces it with existing bigger one.


### References

1. https://x.com/akshay_pachaar/status/2020840784782913605

2. https://hooshaai.substack.com/p/downloading-a-gguf-is-easy-understanding

3. https://vijay.eu/co-authored/llm-inference-internals-apple-silicon/
